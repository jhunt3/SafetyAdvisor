/* New cleaned up version of App.js */
import React from 'react';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import './App.css';
import LocationData from './LocationData';
import SiteMap from './react_components/SiteMap';
import LocationPage from './react_components/LocationPage';
import ReviewPage from './react_components/ReviewPage';

const defaultTags = ["Curbside Pickup", "Hand Sanitizer", "Masks", "Gloves", "Checks Temperature",
"Patio"];

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapClass: "fullMap",
      currLocId: -1,
      locData: new LocationData(),
      sidePageClass:"locPage"
    };
    // Adds hardcoded location data
    this.state.locData.addLocation("Sidney Smith", "Lecture Hall", 43.663098, -79.398568, defaultTags);
    this.state.locData.addLocation("UofT Bookstore", "Store", 43.659213, -79.396960, defaultTags);
    this.state.locData.addLocation("Isabel Bader Theatre", "Theatre", 43.667246, -79.392524, defaultTags);

    this.state.locData.updateTags(0, [{name: defaultTags[4], val: 60}, {name: defaultTags[1], val: 95}, {name: defaultTags[0], val: 20}]);
    this.state.locData.updateTags(1, [{name: defaultTags[2], val: 42.5}, {name: defaultTags[3], val: 0.5}]);
    this.state.locData.updateTags(2, [{name: defaultTags[5], val: 100}]);

    this.state.locData.addReview(0, "John Doe", 4.0, "Lots of hand sanitizer on hand!")

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
    console.log(this.state.sidePageClass);
    if (this.state.mapClass === "sideMap") {
        if(this.state.sidePageClass === "locPage"){
          return (<div className="sidePage">
            <LocationPage locData={this.state.locData.getLoc(this.state.currLocId)} leaveReview={this.leaveReview}/>
          </div>);
        }
        if(this.state.sidePageClass === "leaveReviewPage"){
          return (<div className="sidePage">
            <ReviewPage locData={this.state.locData.getLoc(this.state.currLocId)} backToLocPage={this.backToLocPage}/>
          </div>);
        }

    } else {
      return;
    }
  }
  leaveReview = () => {
    this.setState({sidePageClass: "leaveReviewPage"});

  }
  backToLocPage = () => {
    this.setState({sidePageClass: "locPage"});

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
