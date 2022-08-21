import React from "react"
import { MapContext as GmapContext } from "@react-google-maps/api"
import MapContext from "../context/MapContext"


class Spiderfy extends React.Component {

  static contextType = MapContext

  constructor(props) {
    super(props)
    const oms = require(`npm-overlapping-marker-spiderfier/lib/oms.min`)

    this.oms = new oms.OverlappingMarkerSpiderfier(
      GmapContext._currentValue,
      {}
    )

    this.markerNodeMounted = this.markerNodeMounted.bind(this)
  }

  async markerNodeMounted(ref) {
    setTimeout(() => {
      this.oms.addMarker(ref.marker)

      window.google.maps.event.addListener(ref.marker, "spider_click", e => {
      
        this.context.map.panTo({
          lat: ref.props.latitude,
          lng: ref.props.longitude
        })
        this.context.map.setZoom(15)

        ref.props.setShowingInfoWindow(!ref.props.showingInfoWindow)

      })
    }, 2000)
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, { ref: this.markerNodeMounted })
    )
  }
}

export default Spiderfy