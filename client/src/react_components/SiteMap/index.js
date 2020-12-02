import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';
import { withRouter } from "react-router-dom";

import TagIndicator from './../TagIndicator';


import "./styles.css";

const mapStyle = {
  width: '100%',
  height: '100%'
};

const hideStyle = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
    }
]

const infoWindowStyle = {
  width: '100%',
  height: '100%',
  backgroundcolor: '#e0e0e0'
};


class SiteMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activePlace: {},
      showingInfoWindow: false,
      activeMarker: null
    };

    this.onMarkerMouseover = this.onMarkerMouseover.bind(this);
    this.onMarkerMouseout = this.onMarkerMouseout.bind(this);
  }

  onMarkerMouseover(props, marker, e) {
    if (!this.state.showingInfoWindow) {
      this.setState({
        activePlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
    }
  }

  onMarkerMouseout() {
    this.setState({
      activePlace: {},
      showingInfoWindow: false,
      activeMarker: null
    })
  }

  generateTagIndicators(activePlace) {
    if (activePlace.tags) {
      const tags = activePlace.tags.filter((tag) => {return tag.val !== 0});
      return tags.map((tag) => {return <TagIndicator
                                          name={tag.name}
                                          val={tag.val}
                                        />
      });
    }
    return;
  }

  generateMarkers() {
    return this.props.locations.flatMap((loc) => {
      return <Marker key={loc.id}
                    id={loc.id}
                    name={loc.name}
                    icon={{
                      url: `/static/markers/marker${Math.floor(loc.rating)}.png`,
                      anchor: new this.props.google.maps.Point(32,32),
                      scaledSize: new this.props.google.maps.Size(32,32)
                    }}
                    position={{
                      lat: loc.lat,
                      lng: loc.lng
                    }}
                    tags={loc.tags}
                    onClick={() => {
                      const path = this.props.history.location.pathname.split('/');
                      if (path[path.length - 1] === "" || parseInt(path[path.length - 1]) !== loc.id) {
                        this.props.history.push(`/loc/${loc.id}`);
                      } else {
                        this.props.history.push(`/`);
                      }
                      
                      this.onMarkerMouseout();
                    }}
                    onMouseover={this.onMarkerMouseover}
                    onMouseout={this.onMarkerMouseout}
        />
    });
  }


  render() {
    return (
        <Map
          google={this.props.google}
          zoom={16}
          style={mapStyle}
          initialCenter={{ lat: 43.663, lng: -79.392}}
          styles={hideStyle}>
          {this.generateMarkers()}
          <InfoWindow marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    style={infoWindowStyle}>
              <h1 className="name">{this.state.activePlace.name}</h1>
              {this.generateTagIndicators(this.state.activePlace)}
          </InfoWindow>
        </Map>

    );
  }

}


export default withRouter(GoogleApiWrapper({
  apiKey: 'AIzaSyAoQit1a6-1wL8EneYqGTO4aFTfmpixG4Y'
})(SiteMap));