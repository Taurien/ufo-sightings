import { createContext, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { fetchLocations } from '../redux/slices/mapSlice'


const MapContext = createContext()

const MapContextProvider = ({ children }) => {

  const dispatch = useDispatch()
  const { ufoLocations } = useSelector((state) => state.map)

  const [ loader, setLoader ] = useState(false)
  const [ map, setMap ] = useState(null)
  const [ entryModal, setEntryModal ] = useState(true)
  const [ openBar, setOpenBar ] = useState(false)
  const [ customSearch, setCustomSearch ] = useState(false)
  const [ selectedInSearch, setSelectedInSearch ] = useState(null)


  useEffect(() => {
    if (selectedInSearch) dispatch(fetchLocations(selectedInSearch))

    // if (ufoLocations.hold) setLoader(false)

  }, [selectedInSearch])

  const data = {
    loader,setLoader,
    map, setMap,
    entryModal, setEntryModal,
    openBar, setOpenBar,
    customSearch, setCustomSearch,
    selectedInSearch, setSelectedInSearch,
  }

  return (
    <MapContext.Provider value={ data }>
      {children}
    </MapContext.Provider>
  )
}

export { MapContextProvider }
export default MapContext
