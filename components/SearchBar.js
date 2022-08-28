import { memo, useCallback, useContext, useState } from "react"
import { useSelector } from 'react-redux'
import { Autocomplete, TextField, FormControl, FormGroup, FormControlLabel, Checkbox, Button } from '@mui/material'

import MapContext from "../context/MapContext"
import InputSlider from "./InputSlider"


const SearchBar = ({selectedCountry, }) => {
  // console.log('searchbar')

  const { countries, years, shapes, states, provinces } = useSelector((state) => state.map)
  const { entryModal, statusModal, openBar, setOpenBar, customSearch, setSelectedInSearch, resetMap, resetZoom } = useContext(MapContext)

  const territorySplit = (str) => str && str.split(' ')[0].toLowerCase()
  const arrayOptions = (obj, key) => Object.keys(obj).map(elm => key ? `${elm.toUpperCase()} - ${obj[elm][key]}` : `${elm.toUpperCase()} - ${obj[elm]}`)

  const nations = arrayOptions(countries, 'name')
  
  const [ selectedNation, setSelectedNation ] = useState(null)
  const [ selectedState, setSelectedState ] = useState(null)
  const [ selectedYear, setSelectedYear ] = useState(null)
  const [ selectedShape, setSelectedShape ] = useState(null)
  const [ limitValue, setLimitValue] = useState(30)
  
  const [ nationAutoComp, setNationAutoComp ]= useState(false)
  const [ yearsAutoComp, setYearsAutoComp ]= useState(false)
  const [ shapeAutoComp, setShapeAutoComp ]= useState(false)
  const [ limitSlider, setLimitSlider ]= useState(false)

  const handleSliderChange = (event, newValue) => setLimitValue(newValue)
  const handleInputChange = (event) => setLimitValue(event.target.value === '' ? '' : event.target.value)

  const clearForm = () => {
    setSelectedNation(null)
    setSelectedState(null)
    setSelectedYear(null)
    setSelectedShape(null)
    setNationAutoComp(false)
    setYearsAutoComp(false)
    setShapeAutoComp(false)
    setLimitSlider(false)
  }

  const submitHanlder = (e) => {
    e.preventDefault()
    
    let state
    const territory = territorySplit(selectedState)

    switch (territory) {
      case 'nl':
        state = 'nf'
        break
      case 'qc':
        state = 'pq'
        break
      case 'sk':
         state = 'sa'
        break
      case 'yt':
        state = 'yk'
        break
      default:
        state = territory
    }

    const query = {}
    if (selectedCountry || selectedNation) query.country = selectedCountry || selectedNation
    if (state) query.state = state
    if (selectedYear) query.year = selectedYear
    if (selectedShape) query.shape = selectedShape
    if (limitSlider) query.limit = limitValue

    if (Object.keys(query).length === 0) console.warn('empty query') 
    else {
      console.log(query)
      setOpenBar(false)
      setSelectedInSearch(query)
      clearForm()
    }
  }

  return (
    <div className={`absolute z-10 top-2 left-2  p-0.5 bg-white rounded-md ${openBar && 'w-60 mobile:w-48 overflow-y-auto'} ${(selectedCountry || customSearch) && openBar && 'bottom-1/4'}`}>
      <div className="relative p-1">
        <span className="text-2xl font-bold cursor-pointer"onClick={() => !statusModal && !entryModal && setOpenBar(!openBar)}>
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
                    : <>looking for UFO&apos;s</>
                  }
                </p>
              </div>
            </div>
            
            <div className=" grid grid-flow-row gap-0.5">
              <Button sx={{'textTransform': 'capitalize'}} color='success' className="w-full" variant="contained" onClick={() => {clearForm(); resetMap()}}>
                Reset Map
              </Button>
              {
                selectedCountry &&
                <Button sx={{'textTransform': 'capitalize'}} color='success' className="w-full" variant="contained" onClick={() => resetZoom(selectedCountry)}>
                  Reset {countries[selectedCountry].name} Zoom
                </Button>
              }
            </div>

            <div className=" grid grid-flow-row">
              <span className="w-full font-bold text-xl mb-2">
                {customSearch? 'Search ' : 'Filter '}by...
              </span>
              <form onSubmit={submitHanlder} className='mt-3' >

                {/* ---------------------------------------------------------------- BY COUNTRY */}
                  {
                    customSearch &&
                    <>
                      <FormControlLabel label={'Country'} value={'country'}
                        onChange={() => setNationAutoComp(!nationAutoComp)} control={<Checkbox checked={nationAutoComp} />}
                      />
                      {
                        nationAutoComp &&
                        <Autocomplete autoComplete options={nations}
                          onChange={(e, value) => setSelectedNation(territorySplit(value))} renderInput={(params) => <TextField {...params} label={'Country'} />}
                        />
                      }
                    </>
                  }
                {/* ---------------------------------------------------------------- END COUNTRY */}

                {/* ---------------------------------------------------------------- BY STATE OR PROVINCE */}
                  { 
                    ((selectedNation || selectedCountry) === 'ca' || (selectedNation || selectedCountry) === 'us') &&
                    <Autocomplete
                      autoComplete options={arrayOptions((selectedNation || selectedCountry) === 'ca' ? provinces : states)}
                      renderInput={(params) => <TextField {...params} label={(selectedNation || selectedCountry) === 'ca' ? 'Provinces' : 'States' } />}
                      onChange={(e, value) => setSelectedState(value)} 
                    />
                  }
                {/* ---------------------------------------------------------------- END STATE OR PROVINCE */}

                {/* ---------------------------------------------------------------- BY YEAR OF APPEARANCE */}
                  <FormControlLabel label={'Year'} value={'year'}
                    onChange={() => setYearsAutoComp(!yearsAutoComp)} control={<Checkbox checked={yearsAutoComp} />}
                  />
                  {
                    yearsAutoComp &&
                    <Autocomplete autoComplete options={years}
                      onChange={(e, value) => setSelectedYear(value)} renderInput={(params) => <TextField {...params} label={'Year'} />}
                    />
                  }
                {/* ---------------------------------------------------------------- END YEAR OF APPEARANCE */}

                {/* ---------------------------------------------------------------- BY UFO SHAPE */}
                  <FormControlLabel label={'Shape'} value={'shape'}
                    onChange={() => setShapeAutoComp(!shapeAutoComp)} control={<Checkbox checked={shapeAutoComp} />}
                  />
                  {
                    shapeAutoComp &&
                    <Autocomplete autoComplete options={shapes}
                      onChange={(e, value) => setSelectedShape(value)} renderInput={(params) => <TextField {...params} label={'Shape'} />}
                    />
                  }
                {/* ---------------------------------------------------------------- END UFO SHAPE */}

                {/* ---------------------------------------------------------------- SET LIMIT */}
                  <FormControlLabel label={'Limit'} value={'limit'}
                    onChange={() => setLimitSlider(!limitSlider)} control={<Checkbox checked={limitSlider} />}
                  />
                  { 
                    limitSlider &&
                    <InputSlider limitValue={limitValue} handleSliderChange={handleSliderChange} handleInputChange={handleInputChange } />
                  }
                {/* ---------------------------------------------------------------- END SET LIMIT */}

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
        </div>
      </div>
    </div>
  )
}

export default memo(SearchBar)
