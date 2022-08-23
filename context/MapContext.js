import { createContext, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { fetchLocations } from '../redux/slices/mapSlice'


const MapContext = createContext()

const MapContextProvider = ({ children }) => {

  const dispatch = useDispatch()
  const { status } = useSelector((state) => state.map)

  const [ map, setMap ] = useState(null)
  const [ entryModal, setEntryModal ] = useState(true)
  const [ openBar, setOpenBar ] = useState(false)
  const [ customSearch, setCustomSearch ] = useState(false)
  const [ selectedInSearch, setSelectedInSearch ] = useState(null)
  const [ statusModal, setstatusModal ] = useState(false)


  useEffect(() => {
    if (selectedInSearch) {
      // console.log('seacrh', selectedInSearch, status)
      dispatch(fetchLocations(selectedInSearch))
      setSelectedInSearch(null)
    }
  }, [selectedInSearch])
  
  useEffect(() => {
    if (status.fetching) setstatusModal(true)
    if (!status.fetching) setTimeout(() => { setstatusModal(false) }, 2500)
  }, [status])
  

  const data = {
    map, setMap,
    entryModal, setEntryModal,
    openBar, setOpenBar,
    customSearch, setCustomSearch,
    selectedInSearch, setSelectedInSearch,
    statusModal, setstatusModal
  }

  return (
    <MapContext.Provider value={ data }>
      {children}
    </MapContext.Provider>
  )
}

export { MapContextProvider }
export default MapContext
