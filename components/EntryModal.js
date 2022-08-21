import { useContext } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@mui/material'

import { setSelectedCountry } from '../redux/slices/mapSlice'
import MapContext from '../context/MapContext'


const EntryModal = () => {

  const dispatch = useDispatch()
  const { countries } = useSelector((state) => state.map)

  const { map, entryModal, setEntryModal, setOpenBar, setCustomSearch } = useContext(MapContext)

  const panToCountry = (country) => {
    setEntryModal(false)
    dispatch(setSelectedCountry(countries[country]))
    map.panTo(countries[country].coords)
    map.setZoom(countries[country].zoom)
    setOpenBar(true)
  }

  const ownSearch = () => {
    setCustomSearch(true)
    setOpenBar(true)
    setEntryModal(false)
  }

  return (
    <>
    {
      entryModal  &&
      <div className={`max-w-md absolute z-10 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white rounded p-6`}>
        <div className=' grid grid-flow-row gap-2 justify-items-center'>
          <p className='text-lg font-bold'>Look UFO's in</p>
          <div className='flex flex-wrap justify-center'>
            {
              Object.keys(countries).map((country, index) => (
                <button
                  key={country}
                  className={`w-44 px-3 py-1 inline-flex items-center justify-start mx-1 ${index != 4 && 'mb-2'} border border-gray-300 rounded-md hover:border-[#2E7D32] hover:shadow-md  `}
                  onClick={() => panToCountry(country)}
                >
                  <div className='aspect-square relative w-9 mr-2'>
                    <Image src={countries[country].flag} layout='fill' objectFit='contain' />
                  </div>
                  <span className='w-max'>{countries[country].name}</span>
                </button>
              ))
            }
          </div>
          <p className=' font-bold'>- OR -</p>
          <button 
            className={`w-max px-6 py-2.5 text-white bg-[#2E7D32] font-bold uppercase opacity-60 mobile:opacity-100 rounded-md hover:opacity-100 shadow-md`}
            onClick={ownSearch}
          >
            try my own search
          </button>
        </div>
      </div>
    }
    </>
  )
}

export default EntryModal
