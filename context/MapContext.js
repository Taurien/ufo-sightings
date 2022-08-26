import { createContext, useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setSelectedCountry, resetSlice, fetchLocations, } from '../redux/slices/mapSlice'


const MapContext = createContext()

const MapContextProvider = ({ children }) => {

  const dispatch = useDispatch()
  const { countries, selectedCountry, status, origin } = useSelector((state) => state.map)

  const [ map, setMap ] = useState(null)
  const [ oms, setOms ] = useState(null)
  const [ entryModal, setEntryModal ] = useState(true)
  const [ openBar, setOpenBar ] = useState(false)
  const [ customSearch, setCustomSearch ] = useState(false)
  const [ selectedInSearch, setSelectedInSearch ] = useState(null)
  const [ statusModal, setstatusModal ] = useState(false)


  useEffect(() => {
    // console.log('to fetch')
    if (selectedInSearch) {
      // console.log('fetching')
      // console.log('seacrh', selectedInSearch, status)
      dispatch(fetchLocations(selectedInSearch))
      setSelectedInSearch(null)
    }
  }, [selectedInSearch])
  
  useEffect(() => {
    if (status.fetching) setstatusModal(true)
    if (!status.fetching) setTimeout(() => { setstatusModal(false) }, 2500)
  }, [status])

  const moveMapTo = useCallback(
    (country) => {
      map.panTo(countries[country].coords)
      map.setZoom(countries[country].zoom)
    }, [map, setMap]
  )

  const panToCountry = useCallback(
    (country) => {
      setEntryModal(false)
      dispatch(setSelectedCountry(countries[country]))
      moveMapTo(country)
      setOpenBar(true)
    }, [map, setMap]
  )

  const ownSearch = useCallback(
    () => {
      setCustomSearch(true)
      setOpenBar(true)
      setEntryModal(false)
    }, []
  )

  const resetMap = useCallback(
    () => {
      dispatch(resetSlice())
      map.panTo(origin)
      map.setZoom(2)
      setCustomSearch(false)
      setOpenBar(false)
      setEntryModal(true)
    }, [map, setMap]
  )

  const resetZoom = useCallback(
    (country) => {
      moveMapTo(country)
      setOpenBar(false)
    }, [map, setMap]
  )


  const data = {
    map, setMap,
    oms, setOms,
    entryModal, setEntryModal,
    openBar, setOpenBar,
    customSearch, setCustomSearch,
    selectedInSearch, setSelectedInSearch,
    statusModal, setstatusModal,
    //
    panToCountry,
    ownSearch,
    resetMap,
    resetZoom
  }

  return (
    <MapContext.Provider value={ data }>
      {children}
    </MapContext.Provider>
  )
}

export { MapContextProvider }
export default MapContext
