import { useContext, useEffect } from 'react'

import MapContext from '../context/MapContext'
import ContainerBlock from './ContainerBlock'
import Loader from '../components/Loader'
import EntryModal from '../components/EntryModal'
import SearchBar from '../components/SearchBar'
import MyMap from '../components/MyMap'


export default function Home() {
  
  const { loader } = useContext(MapContext)
  
  return (
    <ContainerBlock className='relative w-screen'>

      <SearchBar />
      <div className='absolute z-10 top-2 right-2 p-0.5 text-center bg-white bg-opacity-60 hover:bg-opacity-100 rounded-full'>
        <h1 className='mx-2 text-2xl font-bold'><span className='mobile:hidden'>UFO Sightings </span><span className='desktop:hidden'>🛸</span><span>👽</span></h1>
      </div>

      <EntryModal />
      { loader && <Loader /> }
      
      <MyMap/>
    </ContainerBlock>
  )
}
