import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import MapContext from '../context/MapContext'
import ContainerBlock from './ContainerBlock'
import EntryModal from '../components/EntryModal'
import SearchBar from '../components/SearchBar'
import MyMap from '../components/MyMap'
import StatusModal from '../components/StatusModal'


export default function Home() {
  console.log('index')

  const { status } = useSelector((state) => state.map)
  const { statusModal } = useContext(MapContext)
  // const [ map1, setMap1 ] = useState(null)

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const gm = window.google
  //     setMap1(gm)
  //   }
    
  //   if (map1 != null){
  //     console.log(map1)
  //     const map = map1.maps.Map(document.getElementById('map_canvas'), {
  //       mapTypeId: map1.maps.MapTypeId.SATELLITE,
  //       center: new map1.maps.LatLng(50, 0), zoom: 6,  // whatevs: fitBounds will override
  //     });
  //     console.log(map)
  //   }
  // }, [map1])
  

  // const map = new gm.Map(document.getElementById('map_canvas'), {
    // mapTypeId: gm.MapTypeId.SATELLITE,
    // center: new gm.LatLng(50, 0), zoom: 6,  // whatevs: fitBounds will override
  // });
  
  return (
    <ContainerBlock className={`font-work_sans min-h-screen border border-solid border-red-600`} >
      <div className='w-4 h4' id="map_canvas"></div>

      {/* <SearchBar /> */}
      <div className='absolute z-10 top-2 right-2 p-0.5 text-center bg-white bg-opacity-60 hover:bg-opacity-100 rounded-full'>
        <h1 className='mx-2 text-2xl font-bold'><span className='mobile:hidden'>UFO Sightings </span><span className='desktop:hidden'>🛸</span><span>👽</span></h1>
      </div>

      {/* <EntryModal /> */}
      {/* { statusModal && <StatusModal fetching={status.fetching} msg={status.response} /> } */}
      
      
      
      {/* <MyMap/> */}
    </ContainerBlock>
  )
}
