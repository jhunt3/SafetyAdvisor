import React from 'react';
import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';

const mapStyle = {
  width: '100%',
  height: '100%'
};

class SiteMap extends React.Component {

  generateMarkers() {
    return this.props.locations.map((loc) => {
      return <Marker key={loc.id}
                     id={loc.id}
                     position={{
                       lat: loc.lat,
                       lng: loc.lng
                     }}
                     onClick={() => {this.props.openLocPage(loc.id);}}
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
        </Map>
    );
  }

}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAoQit1a6-1wL8EneYqGTO4aFTfmpixG4Y'
})(SiteMap);

