import { memo, useContext, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
// import OverlappingMarkerSpiderfier from 'overlapping-marker-spiderfier'

import MapContext from "../context/MapContext"
import UfoMarker from "./UfoMarker"

const FunctSpiderfy = memo((props) => {
  // console.log('spiderfier rendered ->', props)
  const { mapInstance, locations } = props

  const options = {
    circleFootSeparation: 23,
    spiralFootSeparation: 26,
  }
  
  const npmOms = require(`npm-overlapping-marker-spiderfier/lib/oms.min`)

  // const [first, setfirst] = useState([])
  const markersRefs = useRef([])
  
  // // const newOms = new OverlappingMarkerSpiderfier(map, options)
  // // const test = window.OverlappingMarkerSpiderfier(map, options)
  const newNpmOms = new npmOms.OverlappingMarkerSpiderfier(mapInstance, options)

  // console.log(newOms)
  // console.log(test)
  // console.log(newNpmOms)

  // delete from map or oms
  // markersRefs.current.map({marker} => {
    // marker.setMap(null)
  // })

  // useEffect(() => {
  //   console.log('------- useEffect in spider', ufoLocations, selectedCountry)
  //   // console.log('props.locations in useEffect', props.locations)
  //   if (props.locations == true ) { //&& ufoLocations.active == null && selectedCountry == null
  //     // console.log(newNpmOms)
  //     const markers = newNpmOms.getMarkers()
  //     // console.log('----------- supossed 2 be markers', markers)
  //     // console.log(props.locations)
  //     // console.log('forgetAllMarkers/removeAllMarkers')
  //   } else {
  //     console.log('down here')
  //     // console.log(newNpmOms)
  //     const markers = newNpmOms.getMarkers()
  //     newNpmOms.removeAllMarkers()
  //     newNpmOms.forgetAllMarkers()
  //     // console.log('----------- supossed 2 be markers', markers)
  //   }
  // }, [ufoLocations])
  
  

  const markerNodeMounted = (marker, markerData) => {
    // console.log('mount marker ->', marker, markerData)
    
    newNpmOms.addMarker(marker)
    
    window.google.maps.event.addListener(marker, "spider_click", e => {
      mapInstance.panTo({
        lat: markerData.latitude,
        lng: markerData.longitude
      })
      mapInstance.setZoom(15)
      
      markersRefs.current[markerData.nRef].props.setShowingInfoWindow(!markerData.showingInfoWindow)
    })
  }

  return (
    locations.map((marker, index) => (
      <UfoMarker
        refs={(marker) => markersRefs.current[index] = marker}
        onMount={markerNodeMounted}
        markerData={{...marker, nRef: index}}
        key={index}
      />
    ))
  )
})

export default FunctSpiderfy