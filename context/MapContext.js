import { createContext, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'


const MapContext = createContext()

const MapContextProvider = ({ children }) => {

  const {  } = useSelector((state) => state.map)

  const [ loader, setLoader ] = useState(false)
  const [ map, setMap ] = useState(null)
  const [ entryModal, setEntryModal ] = useState(true)
  const [ openBar, setOpenBar ] = useState(false)
  const [ customSearch, setCustomSearch ] = useState(false)
  const [ selectedInSearch, setSelectedInSearch ] = useState(null)

  useEffect(() => {
      if (selectedInSearch) {
        console.log(selectedInSearch)
        setTimeout(() => {
          setLoader(false)
        }, 2000);
      }
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
