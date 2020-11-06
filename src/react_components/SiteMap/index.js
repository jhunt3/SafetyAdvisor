import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';

import TagIndicator from './../TagIndicator';


import "./styles.css";

const mapStyle = {
  width: '100%',
  height: '100%'
};

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
                      url: `${process.env.PUBLIC_URL}/assets/images/markers/marker${Math.floor(loc.rating)}.png`,
                      anchor: new this.props.google.maps.Point(32,32),
                      scaledSize: new this.props.google.maps.Size(32,32)
                    }}
                    position={{
                      lat: loc.lat,
                      lng: loc.lng
                    }}
                    tags={loc.tags}
                    onClick={() => {
                      this.props.openLocPage(loc.id);
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
          initialCenter={{ lat: 43.663, lng: -79.392}}>
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

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAoQit1a6-1wL8EneYqGTO4aFTfmpixG4Y'
})(SiteMap);

