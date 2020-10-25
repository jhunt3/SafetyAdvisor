/* New cleaned up version of App.js */
import React from 'react';

import './App.css';
import LocationData from './LocationData';
import SiteMap from './react_components/SiteMap';
import LocationPage from './react_components/LocationPage';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapClass: "fullMap",
      currLocId: -1,
      locData: new LocationData()
    };
    // Adds hardcoded location data
    this.state.locData.addLocation("Sidney Smith", "Lecture Hall", 43.663098, -79.398568);
    this.state.locData.addLocation("UofT Bookstore", "Store", 43.659213, -79.396960);
    this.state.locData.addLocation("Isabel Bader Theatre", "Theatre", 43.667246, -79.392524);

    this.openLocPage = this.openLocPage.bind(this);
  }
  // Marker Handler
  openLocPage(id) {
    const otherSetting = (this.state.mapClass === "fullMap") ? "sideMap" : "fullMap";
    if ((this.state.currLocId === -1) || (this.state.currLocId === id)) {
      this.setState({mapClass: otherSetting, currLocId: ((this.state.currLocId === id) ? -1 : id)});
    } else {
      this.setState({currLocId: id});
    }
  }

  // We might want to use routers instead; this works for now.
  renderSidePage() {
    if (this.state.mapClass === "sideMap") {
      return (<div className="sidePage">
        <LocationPage locData={this.state.locData.getLoc(this.state.currLocId)}/>
      </div>);
    } else {
      return;
    }
  }

  render() {
    return (
      <div>
          {this.renderSidePage()}
          <div className={this.state.mapClass}>
          <SiteMap locations={this.state.locData.getGeoLocData()} openLocPage={this.openLocPage}/>
          </div>
      </div>
      
    );
  }

}

export default App;

