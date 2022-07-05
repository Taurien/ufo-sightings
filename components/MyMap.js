import { useContext, useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from '@react-google-maps/api'
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
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_API_KEY,
    libraries
  })

  if (!isLoaded) return <div className='w-full h-full'><h1>ERROR</h1></div>

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
    {/* { map && <Marker position={center} /> } */}
    { map &&
      <MarkerClusterer>
      {(clusterer) =>
        movies?.map((marker, index) => (
          <MyMarker
            clusterer={clusterer}
            markerData={marker}
            key={index}
          />
        )
      )}
      </MarkerClusterer>
    }
  </GoogleMap>
  )
}

export default MyMap