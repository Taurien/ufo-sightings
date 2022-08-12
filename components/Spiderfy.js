import React from "react";
import { MapContext } from "@react-google-maps/api";
import MyMapContext from "../context/MyMapContext";


class Spiderfy extends React.Component {

  static contextType = MyMapContext

  constructor(props) {
    super(props);
    const oms = require(`npm-overlapping-marker-spiderfier/lib/oms.min`);

    this.oms = new oms.OverlappingMarkerSpiderfier(
      MapContext._currentValue, // 1*
      {}
    );

    this.markerNodeMounted = this.markerNodeMounted.bind(this);
  }

  async markerNodeMounted(ref) {
    setTimeout(() => {
      this.oms.addMarker(ref.marker)

      window.google.maps.event.addListener(ref.marker, "spider_click", e => {
      
        this.context.map.panTo({
          lat: ref.props.latitude,
          lng: ref.props.longitude
        })
        this.context.map.setZoom(17)

        ref.props.setShowingInfoWindow(!ref.props.showingInfoWindow)

      });
    }, 2000);
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, { ref: this.markerNodeMounted })
    );
  }
}

export default Spiderfy;