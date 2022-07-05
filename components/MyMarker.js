import { useContext, useState } from "react"
import { Circle, InfoWindow, Marker } from "@react-google-maps/api"
import MyMapContext from "../context/MyMapContext"

const MyMarker = ({ clusterer, markerData }) => {
    const { map } = useContext(MyMapContext)

    const [mapMarker, setMapMarker] = useState(null)
    const [showingInfoWindow, setShowingInfoWindow] = useState(false)

    const onMarkerClick = () => {
        setShowingInfoWindow(true)

        map.panTo({
            lat: markerData.latitude,
            lng: markerData.longitude
        })
        map.setZoom(17)
    }
    const onInfoWindowClose = () => setShowingInfoWindow(false)
    const onLoad = (mapMarker) => setMapMarker(mapMarker)

    const circleOptions = {
        strokeOpacity: 0.5,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        // strokeColor: "#8BC34A",
        // fillColor: "#8BC34A",
    }

    return (
        <Marker
            clusterer={clusterer}
            onLoad={onLoad}
            position={{
                lat: markerData.latitude,
                lng: markerData.longitude
            }}
            clickable
            onClick={onMarkerClick}
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
                        lat: markerData.latitude,
                        lng: markerData.longitude
                    }}
                    onCloseClick={onInfoWindowClose}
                >
                    <div className="">
                        <p className="mb-2 text-base font-bold">📼 <i>{`"${markerData.title}" (${markerData.year})`}</i></p>
                        <p><span className="font-bold">Directed by:</span> <i>{markerData.director}</i></p>
                        <p><span className="font-bold">Written by:</span> <i>{markerData.writer}</i></p>
                        <p><span className="font-bold">Produced by:</span> <i>{markerData.production}</i></p>
                        <p><span className="font-bold">Distributed by:</span> <i>{markerData.distributor}</i></p>
                        <p className="mt-2"><span className="font-bold">Location:</span> {markerData.locations}</p>
                    </div>
                </InfoWindow>
                
                </>
            }
            <Circle
                center={{
                    lat: markerData.latitude,
                    lng: markerData.longitude
                }}
                radius={100}
                options={circleOptions}
            />
        </Marker>
    )
}

export default MyMarker