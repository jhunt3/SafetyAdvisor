import React from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const mapStyle = {
  width: '100%',
  height: '100%'
};

class SideMap extends React.Component {

  render() {
    return (
        <Map 
          google={this.props.google}
          zoom={16}
          style={mapStyle}
          initialCenter={{ lat: 43.663, lng: -79.392}}
        />   
    );
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAoQit1a6-1wL8EneYqGTO4aFTfmpixG4Y'
})(SideMap);

