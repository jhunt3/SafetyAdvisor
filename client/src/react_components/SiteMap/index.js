import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow} from 'google-maps-react';
import { withRouter } from "react-router-dom";
import { checkSession } from '../../helperJS/loginHelper';
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
      activeMarker: null,
      currentUser:"",
      isAdmin: false,
      //lat:null,
      //lng:null
    };
    //console.log('Does this run')
    checkSession(this);
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
    if(this.props.locations === null){return null}
    return this.props.locations.flatMap((loc) => {
        return <Marker key={loc._id}
                    id={loc._id}
                    name={loc.name}
                    icon={{
                      url: `/static/markers/marker${Math.floor(loc.rating)}.png`,
                      anchor: new this.props.google.maps.Point(loc.show / 2,  loc.show),
                      scaledSize: new this.props.google.maps.Size(loc.show, loc.show)
                    }}
                    position={{
                      lat: loc.lat,
                      lng: loc.lng
                    }}
                    tags={loc.tags}
                    onClick={() => {
                      const path = this.props.history.location.pathname.split('/');
                      if (path[path.length - 1] === "" || path[path.length - 1] !== loc._id) {
                        this.props.history.push(`/`);
                        this.props.history.push(`/loc/${loc._id}`);
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
  addMarker(){
    console.log('AddMarker')
    console.log(this.props.sidePage)
    if(this.props.isAdmin && (this.props.sidePage === 'addLocation')){
      return <Marker 
      name={'New Location'}
      icon={{
        url: `/static/markers/markerNew.png`,
        anchor: new this.props.google.maps.Point(16,32),
        scaledSize: new this.props.google.maps.Size(32,32)
      }}
      position={{lat: this.props.lat, lng: this.props.lng}}
      draggable={true}
	  />

	
    }else{return null}
  }

  handleClick (t, map, coord){
	if(this.props.sidePage === 'addLocation'){
	const { latLng } = coord;
	const lat = latLng.lat();
	const lng = latLng.lng();
	console.log(lat,lng)
	this.setState({lat: lat, lng: lng})
	this.props.setNewLoc(lat, lng)
	}
  }
  render() {
    return (
        <Map
	  onClick={this.handleClick.bind(this)}
          google={this.props.google}
          zoom={16}
          style={mapStyle}
          initialCenter={{ lat: 43.663, lng: -79.392}}
          styles={hideStyle}>
          {this.generateMarkers()}
	    {this.addMarker()}		
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
