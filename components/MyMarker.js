import React from "react";
import { useContext, useState } from "react"
import { Circle, InfoWindow, Marker } from "@react-google-maps/api"
import MyMapContext from "../context/MyMapContext"


const MyMarker = React.forwardRef((props, ref) => {

    const [mapMarker, setMapMarker] = useState(null)
    const [showingInfoWindow, setShowingInfoWindow] = useState(false)

    // const onMarkerClick = () => {
    //   // 
    // }
    
    const onInfoWindowClose = () => setShowingInfoWindow(false)
    const onLoad = (mapMarker) => setMapMarker(mapMarker)

    const circleOptions = {
        strokeOpacity: 0.6,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        strokeColor: "#fca311",
        // fillColor: "#",
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
                url: `/camera.svg`,
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(30, 30),
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
                        <p className="mb-2 text-base font-bold">📼 <i>{`"${props.title}" (${props.year})`}</i></p>
                        <p><span className="font-bold">Directed by:</span> <i>{props.director}</i></p>
                        <p><span className="font-bold">Written by:</span> <i>{props.writer}</i></p>
                        <p><span className="font-bold">Produced by:</span> <i>{props.production}</i></p>
                        <p><span className="font-bold">Distributed by:</span> <i>{props.distributor}</i></p>
                        <p className="mt-2"><span className="font-bold">Location:</span> {props.locations}</p>
                    </div>
                </InfoWindow>
                
                </>
            }
            <Circle
                center={{
                    lat: +props.latitude,
                    lng: +props.longitude
                }}
                radius={100}
                options={circleOptions}
            />
        </Marker>
    )
})

export default MyMarker