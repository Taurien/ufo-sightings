import { useContext, useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { Autocomplete, TextField, FormControl, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material'

import { resetSlice } from '../redux/slices/mapSlice'
import MapContext from "../context/MapContext"


const SearchBar = () => {

  const dispatch = useDispatch()
  const { origin, countries, years, shapes, states, provinces, selectedCountry } = useSelector((state) => state.map)

  const { statusModal,  map, setEntryModal, openBar, setOpenBar, customSearch, setCustomSearch, setSelectedInSearch } = useContext(MapContext)

  const territorySplit = (str) => str && str.split(' ')[0].toLowerCase()
  const arrayOptions = (obj, subParam ) => Object.keys(obj).map(elm => subParam ? `${elm.toUpperCase()} - ${obj[elm][subParam]}` : `${elm.toUpperCase()} - ${obj[elm]}`)

  const nations = arrayOptions(countries, 'name')
  
  const [ selectedNation, setSelectedNation ] = useState(null)
  const [ selectedState, setSelectedIState ] = useState(null)
  const [ selectedYear, setSelectedYear ] = useState(null)
  const [ selectedShape, setSelectedShape ] = useState(null)
  
  const [ nationAutoComp, setNationAutoComp ]= useState(false)
  const [ yearsAutoComp, setYearsAutoComp ]= useState(false)
  const [ shapeAutoComp, setShapeAutoComp ]= useState(false)

  useEffect(() => {
    if (selectedCountry) setSelectedNation(selectedCountry)
  }, [selectedCountry])
  
  const resetZoom = () => {
    map.panTo(countries[selectedCountry].coords)
    map.setZoom(countries[selectedCountry].zoom)
    setOpenBar(false)
  }

  const clearForm = () => {
    setSelectedNation(selectedCountry ? selectedCountry : null)
    setSelectedIState(null)
    setSelectedYear(null)
    setSelectedShape(null)
    setNationAutoComp(false)
    setYearsAutoComp(false)
    setShapeAutoComp(false)
  }

  const resetMap = () => {
    clearForm()
    dispatch(resetSlice())
    map.panTo(origin)
    map.setZoom(2)
    setCustomSearch(false)
    setOpenBar(false)
    setEntryModal(true)
  }

  const submitHanlder = (e) => {
    e.preventDefault()
    
    let state
    const territory = territorySplit(selectedState)

    switch (territory) {
      case 'nl':
        state = 'nf';
        break;
      case 'qc':
        state = 'pq';
        break;
      case 'sk':
         state = 'sa';
        break;
      case 'yt':
        state = 'yk';
        break;
      default:
        state = territory
    }

    const query = {}
    if (selectedCountry || selectedNation) query.country = selectedCountry || selectedNation
    if (state) query.state = state
    if (selectedYear) query.year = selectedYear
    if (selectedShape) query.shape = selectedShape
    // if (limit) query.limit = limit

    if (Object.keys(query).length === 0) console.warn('empty query') 
    else {
      setOpenBar(false)
      setSelectedInSearch(query)
      clearForm()
    }
  }

  return (
    <div className={`absolute z-10 top-2 left-2  p-0.5 bg-white rounded-md ${openBar && 'w-60 mobile:w-48 overflow-y-auto'} ${(selectedCountry || customSearch) && openBar && 'bottom-1/4'}`}>
      <div className="relative p-1">
        <span className="text-2xl font-bold cursor-pointer"onClick={() => !statusModal && setOpenBar(!openBar)}>
          🛸{openBar && 'Options'}
        </span>
        <div className={`w-full grid grid-flow-row gap-2 ${openBar && 'p-2'}`}>
        {
          openBar &&
          <>

            <div className=" grid grid-flow-row gap-1">
              <div className="grid grid-flow-row font-bold text-xl text-center">
                <p className="">You&apos;re</p>
                <p className="">
                  {
                    selectedCountry
                    ? <>in <span className="italic">{countries[selectedCountry].name}</span></>
                    : 'xxxxxxxxxxxxxx'
                  }
                </p>
              </div>
            </div>
            
            {
              (selectedCountry || customSearch) &&
              <>
                <div className=" grid grid-flow-row gap-0.5">
                  <Button sx={{'textTransform': 'capitalize'}} color='success' className="w-full" variant="contained" onClick={() => resetMap()}>
                    Reset Map
                  </Button>
                  {
                    selectedCountry &&
                    <Button sx={{'textTransform': 'capitalize'}} color='success' className="w-full" variant="contained" onClick={() => resetZoom()}>
                      Reset {countries[selectedCountry].name} Zoom
                    </Button>
                  }
                </div>

                <div className=" grid grid-flow-row">
                  <span className="w-full font-bold text-xl mb-2">
                    {customSearch? 'Search by' : 'Filter by'}...
                  </span>
                  <form onSubmit={submitHanlder} className='mt-3' >
                    {/* BY COUNTRY */}
                      {
                        customSearch &&
                        <>
                          {
                            nationAutoComp &&
                            <Autocomplete
                              options={nations}
                              autoComplete
                              renderInput={(params) => <TextField {...params} label={'Country'} />}
                              onChange={(e, value) => setSelectedNation(territorySplit(value))}
                            />
                          }
                          <FormControlLabel
                            onChange={() => setNationAutoComp(!nationAutoComp)}
                            label={'Country'}
                            value={'country'} 
                            control={<Checkbox checked={nationAutoComp} />}
                          />
                        </>
                      }
                      
                    {/* END COUNTRY */}
                    {/* BY STATE OR PROVINCE */}
                      { (selectedNation === 'ca' || selectedNation === 'us')
                        && <Autocomplete
                        options={arrayOptions(selectedNation === 'ca' ? provinces : states)}
                        autoComplete
                        renderInput={(params) => <TextField {...params} label={selectedNation === 'ca' ? 'Provinces' : 'States' } />}
                        onChange={(e, value) => setSelectedIState(value)}
                        />
                      }
                    {/* END STATE OR PROVINCE */}
                    {/* BY YEAR OF APPEARANCE */}
                      {
                        yearsAutoComp &&
                        <Autocomplete
                          options={years}
                          autoComplete
                          renderInput={(params) => <TextField {...params} label={'Year'} />}
                          onChange={(e, value) => setSelectedYear(value)}
                        />
                      }
                      <FormControlLabel
                        onChange={() => setYearsAutoComp(!yearsAutoComp)}
                        label={'Year'}
                        value={'year'} 
                        control={<Checkbox checked={yearsAutoComp} />}
                      />
                    {/* END YEAR OF APPEARANCE */}
                    {/* BY UFO SHAPE */}
                      {
                        shapeAutoComp &&
                        <Autocomplete
                          options={shapes}
                          autoComplete
                          renderInput={(params) => <TextField {...params} label={'Shape'} />}
                          onChange={(e, value) => setSelectedShape(value)}
                        />
                      }
                      <FormControlLabel
                        onChange={() => setShapeAutoComp(!shapeAutoComp)}
                        label={'Shape'}
                        value={'shape'} 
                        control={<Checkbox checked={shapeAutoComp} />}
                      />
                    {/* END UFO SHAPE */}
                    <div className="grid grid-flow-col">
                      <Button onClick={clearForm} color='success' className="w-full" variant="outlined">
                        Clear
                      </Button>
                      <Button type="submit" color='success' className="w-full" variant="contained">
                        Seacrh
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            }

          </>
        }
        </div>
      </div>
    </div>
  )
}

export default SearchBar
