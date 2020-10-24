/* New cleaned up version of App.js */
import React from 'react';

import './App.css';
import SiteMap from './react_components/SiteMap';

const locations = [
  // Sidney Smith
  {id: 0, lat: 43.663098, lng: -79.398568},
  // Bookstore
  {id: 1, lat: 43.659213, lng: -79.396960},
  // Isabel Bader
  {id: 2, lat: 43.667246, lng: -79.392524}
]

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapClass: "fullMap",
      currLocId: -1
    };
    this.openLocPage = this.openLocPage.bind(this);
  }
  openLocPage(id) {
    const otherSetting = (this.state.mapClass === "fullMap") ? "sideMap" : "fullMap";
    if ((this.state.currLocId === -1) || (this.state.currLocId === id)) {
      this.setState({mapClass: otherSetting, currLocId: ((this.state.currLocId === id) ? -1 : id)});
    } else {
      this.setState({currLocId: id});
    }
    console.log(this.state);
  }
  render() {
    return (
      <div>
        <div className={this.state.mapClass}>
          <SiteMap locations={locations} openLocPage={this.openLocPage}/>
        </div>
      </div>
      
    );
  }

}

export default App;

