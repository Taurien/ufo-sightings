import { useContext, useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from '@react-google-maps/api'
import Spiderfy from './Spiderfy.js'
import MyMarker from './MyMarker'
import MyMapContext from '../context/MyMapContext'
const libraries = ['places']

const MyMap = ({ props }) => {

  const {
    center,
    map,
    setMap,
    movies,
    filteredMovies
  } = useContext(MyMapContext)

  const { isLoaded } = useJsApiLoader({
    id: 'faf1d675e07babbe',
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries
  })

  if (!isLoaded) return <div className='w-full h-full flex items-center justify-center'><h1>Smth went wrong :c</h1></div>

  return (
    <GoogleMap
    mapContainerClassName=' w-full h-full'
    center={center}
    zoom={11}
    onLoad={map => {
      setTimeout(() => {
        setMap(map)
      }, 1000)
    }}
    options={{
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControlOptions: { position: 6 },
    }}
  >
    { map &&
      <Spiderfy>
        {movies?.map((marker, index) => (
          <MyMarker
            // clusterer={clusterer}
            {...marker}
            key={index}
          />
        ))}
      </Spiderfy>
    }
  </GoogleMap>
  )
}

export default MyMap