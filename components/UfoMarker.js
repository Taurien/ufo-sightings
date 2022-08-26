import { useRef, useState } from "react"
import { Circle, InfoWindow, Marker } from "@react-google-maps/api"


const UfoMarker = (props) => {
  // console.log('marker rendered', props)
  const {markerData, onMount, refs } = props

  const [mapMarker, setMapMarker] = useState(null)
  const [ufoCircle, setUfoCircle] = useState(null)
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)

  const onInfoWindowClose = () => setShowingInfoWindow(false)
  const onLoad = (mapMarker) => {
    setMapMarker(mapMarker)
    onMount(mapMarker, markerData)
  }

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
      ref={refs}
      showingInfoWindow={showingInfoWindow}
      setShowingInfoWindow={setShowingInfoWindow}
      onLoad={onLoad}
      onUnmount={marker => {
        marker.setMap(null)
        ufoCircle?.setMap(null)
        setMapMarker(null)
      }}
      position={{
        lat: +markerData.latitude,
        lng: +markerData.longitude
      }}
      clickable
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
            lat: markerData.latitude+0.0003,
            lng: markerData.longitude
          }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="">
            <p className="mb-2 text-base font-bold">🛸</p>
            <p><span className="font-bold">DateTime:</span> {markerData.datetime}</p>
            <p><span className="font-bold">Duration:</span> {markerData['duration (hours/min)']}</p>
            <p><span className="font-bold">Shape:</span> {markerData.shape}</p>
            <p className="mt-2"><span className="font-bold">Comments:</span> &ldquo;<i>{markerData.comments}</i>&ldquo;</p>
            <p className="mt-2 capitalize"><span className="font-bold">Location:</span> {markerData.city}</p>
          </div>
        </InfoWindow>
        
        </>
      }
      {/* <Circle
        onLoad={circle => setUfoCircle(circle)}
        onUnmount={() => ufoCircle.setMap(null)}
        center={{
          lat: +markerData.latitude,
          lng: +markerData.longitude
        }}
        radius={300}
        options={circleOptions}
      /> */}
    </Marker>
  )
}

export default UfoMarker
