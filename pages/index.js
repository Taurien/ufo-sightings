import ContainerBlock from './ContainerBlock'

import { useContext, useEffect, useState } from 'react'

import MyMapContext from '../context/MyMapContext'
import SearchBar from '../components/SearchBar'
import MyMap from '../components/MyMap'

const center = { lat: 37.7562, lng: -122.4412 }

export default function Home() {

  const { setMovies, setHoldMovies } = useContext(MyMapContext)
  
  const fetchData = async () => {
    const res = await fetch('/api/fixed-locations')
    const { result } = await res.json()
    setMovies(result)
    setHoldMovies(result)
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  return (
    <ContainerBlock className='relative w-screen'>
      <SearchBar />
      
      <div className='absolute z-10 top-2 right-2 p-0.5 text-center bg-white bg-opacity-60 hover:bg-opacity-100 rounded-full'>
        <h1 className='mx-4 text-2xl font-bold'><span className='mobile:hidden'>SF Movies</span><span className='desktop:hidden'>SFM</span> <span>🎬</span></h1>
      </div>
      
      <MyMap center={center}/>
    </ContainerBlock>
  )
}
