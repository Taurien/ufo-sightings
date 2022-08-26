import { memo, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import MapContext from '../context/MapContext'
import ContainerBlock from './ContainerBlock'
import SearchBar from '../components/SearchBar'
import EntryModal from '../components/EntryModal'
import StatusModal from '../components/StatusModal'
import MyMap from '../components/MyMap'


const Index = () => {
  // console.log('index')

  const { countries, status, selectedCountry } = useSelector((state) => state.map)
  const { openBar, setOpenBar, entryModal, statusModal, panToCountry, ownSearch } = useContext(MapContext)

  return (
    <ContainerBlock className={`font-work_san`} >

      <SearchBar selectedCountry={selectedCountry}/>
      <div className='absolute z-10 top-2 right-2 p-0.5 text-center bg-white bg-opacity-60 hover:bg-opacity-100 rounded-full'>
        <h1 className='mx-2 text-2xl font-bold'><span className='mobile:hidden'>UFO Sightings </span><span className='desktop:hidden'>🛸</span><span>👽</span></h1>
      </div>

      { entryModal && <EntryModal countries={countries} handlePanToCountry={panToCountry} handleOwnSearch={ownSearch}/> }
      { statusModal && <StatusModal fetching={status.fetching} msg={status.response} /> }
      
      <MyMap/>
    </ContainerBlock>
  )
}

export default memo(Index)
