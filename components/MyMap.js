import { memo, useCallback, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

import MapContext from '../context/MapContext'
import FunctSpiderfy from './Spiderfy-funct'

const libraries = ['places']


const MyMap = memo((props) => {

  // console.log('map compo')

  const { center, ufoLocations } = useSelector((state) => state.map)

  const { map, setMap } = useContext(MapContext)

  const { isLoaded } = useJsApiLoader({
    id: 'faf1d675e07babbe',
    googleMapsApiKey: process.env.NEXT_PUBLIC_ENVIRONMENT ? '' : process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries
  })

  if (!isLoaded) return <div className='w-full h-full flex items-center justify-center'><h1>Loading Map...</h1></div>

  return (
    <GoogleMap
      mapContainerClassName=' w-full h-full'
      center={center}
      zoom={2}
      onLoad={map => {
        // setTimeout(() => {
          setMap(map)
        // }, 1000)
      }}
      options={{streetViewControl: false, fullscreenControl: false, mapTypeControl: false,}}
    >
      {
        map && ufoLocations?.active && 
        <FunctSpiderfy mapInstance={map} locations={ufoLocations.active}/>
      }
    </GoogleMap>
  )
})

export default MyMap
