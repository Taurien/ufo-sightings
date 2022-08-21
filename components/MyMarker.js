import React, { useState } from "react"
import { Circle, InfoWindow, Marker } from "@react-google-maps/api"

import MapContext from "../context/MapContext"


const MyMarker = React.forwardRef((props, ref) => {

  const [mapMarker, setMapMarker] = useState(null)
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)

  // const onMarkerClick = () => {
  //   // 
  // }
  
  const onInfoWindowClose = () => setShowingInfoWindow(false)
  const onLoad = (mapMarker) => setMapMarker(mapMarker)

  const circleOptions = {
    strokeOpacity: 0.5,
    strokeWeight: 3,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    strokeColor: "#8BC34A",
    fillColor: "#8BC34A",
  }

  return (
    <Marker
      {...props}
      ref={ref}
      showingInfoWindow={showingInfoWindow}
      setShowingInfoWindow={setShowingInfoWindow}
      onLoad={onLoad}
      position={{
        lat: +props.latitude,
        lng: +props.longitude
      }}
      clickable
      // onClick={onMarkerClick}
      icon={{
        url: `/assets/ovni.svg`,
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 20),
        scaledSize: new window.google.maps.Size(40, 40),
      }}
    >
      {
        showingInfoWindow &&
        <>
        <InfoWindow
          position={{
            lat: props.latitude+0.0003,
            lng: props.longitude
          }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="">
            <p className="mb-2 text-base font-bold">🛸</p>
            <p><span className="font-bold">DateTime:</span> {props.datetime}</p>
            <p><span className="font-bold">Duration:</span> {props['duration (hours/min)']}</p>
            <p><span className="font-bold">Shape:</span> {props.shape}</p>
            <p className="mt-2"><span className="font-bold">Comments:</span> &ldquo;<i>{props.comments}</i>&ldquo;</p>
            <p className="mt-2 capitalize"><span className="font-bold">Location:</span> {props.city}</p>
          </div>
        </InfoWindow>
        
        </>
      }
      <Circle
        center={{
          lat: +props.latitude,
          lng: +props.longitude
        }}
        radius={300}
        options={circleOptions}
      />
    </Marker>
  )
})

MyMarker.displayName = 'MyMarker'

export default MyMarker
