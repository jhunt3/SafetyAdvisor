/* New cleaned up version of App.js */
import React from 'react';

import './App.css';
import LocationData from './LocationData';
import UserData from './UserData';
import SiteMap from './react_components/SiteMap';
import LocationPage from './react_components/LocationPage';
import UserPage from './react_components/UserPage';
import SearchPage from './react_components/Search/searchPage';
import SearchForm from './react_components/Search/searchFormPage';
import ReviewPage from './react_components/ReviewPage'
import LoginPage from './react_components/LoginPage'
const defaultTags = ["Curbside Pickup", "Hand Sanitizer", "Masks", "Gloves", "Checks Temperature", "Patio"];

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapClass: "fullMap",
      overlayClass: "none",
      userLoggedIn: "",
      currLocId: -1,
      currUserId: -1,
      currSearchQuery: -1,
      showSearchPage: false,
      locData: new LocationData(),
      userData: new UserData(),
      sidePageClass:"locPage"
    };
    // Adds hardcoded location data
    this.state.locData.addLocation("Sidney Smith", "Lecture Hall", 43.663098, -79.398568, defaultTags);
    this.state.locData.addLocation("UofT Bookstore", "Store", 43.659213, -79.396960, defaultTags);
    this.state.locData.addLocation("Isabel Bader Theatre", "Theatre", 43.667246, -79.392524, defaultTags);

    this.state.locData.updateTags(0, [{name: defaultTags[4], val: 60}, {name: defaultTags[1], val: 95}, {name: defaultTags[0], val: 20}]);
    this.state.locData.updateTags(1, [{name: defaultTags[2], val: 42.5}, {name: defaultTags[3], val: 0.5}]);
    this.state.locData.updateTags(2, [{name: defaultTags[5], val: 100}]);

    this.state.userData.addUser("johnsmith", "js")
    this.state.userData.addUser("janedoe", "jd")

    this.state.userData.addReview(0, 0, 4.0, "Lots of hand sanitizer on hand!")
    this.state.userData.addReview(0, 1, 1.0, "Washrooms infrequently cleaned.")
    this.state.locData.addReview(0, "johnsmith", 4.0, "Lots of hand sanitizer on hand!")
    this.state.locData.addReview(0, "janedoe", 4.5, "Washrooms infrequently cleaned. Terrible, but I'll give a high rating for testing purposes.")

    this.openLocPage = this.openLocPage.bind(this);
    this.openUserPage = this.openUserPage.bind(this);
    this.openSearchPage = this.openSearchPage.bind(this);
    this.setSearchResult =this.setSearchResult.bind(this);
    this.closeSidePage = this.closeSidePage.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);
    this.handleLoginAttempt = this.handleLoginAttempt.bind(this);
  }
  // Marker Handler
  openLocPage(id) {
    const otherSetting = (this.state.mapClass === "fullMap") ? "sideMap" : "fullMap";
    this.setState({sidePageClass: "locPage"});
    if (((this.state.currLocId === -1) || (this.state.currLocId === id)) && !(this.state.showSearchPage)) {
      this.setState({currUserId: -1, showSearchPage: false, mapClass: otherSetting, currLocId: ((this.state.currLocId === id) ? -1 : id)});
    } else {
      this.setState({currUserId: -1, showSearchPage: false, currLocId: id});
    }
  }
  openUserPage(username) {
    this.setState({currUserId: username});
    this.setState({sidePageClass: "userPage"});

  }

  openSearchPage() {
    this.setState({showSearchPage: true, currSearchQuery: -1, currLocId: -1, mapClass: "sideMap"});
  }

  setSearchResult(query) {
    this.setState({currSearchQuery: query});
  }

  // We might want to use routers instead; this works for now.
  renderSidePage() {
    if (this.state.mapClass === "sideMap") {
        if (this.state.showSearchPage) {
          if (this.state.currSearchQuery === -1) {
            return (<div className="sidePage">
              <SearchForm setSearchResult={this.setSearchResult}/>
            </div>);
          } else {
            return (<div className="sidePage">
              <SearchPage locData={this.state.locData.getLocationsWithQuery(this.state.currSearchQuery)} userData={this.state.userData.getUser(this.state.currUserId)} openLocPage={this.openLocPage} />
            </div>);
          }  
        }
        if (this.state.currUserId !== -1 && this.state.sidePageClass === 'userPage') {
            return (<div className="sidePage">
              <img className="exitButton" src={`${process.env.PUBLIC_URL}/assets/images/exit.png`} title={'Close Side Panel'} onClick={this.closeSidePage}/>
              <UserPage locData={this.state.locData.locations} userData={this.state.userData.getUser(this.state.currUserId)}/>
            </div>);
        }
        if(this.state.sidePageClass === "leaveReviewPage"){
            return (<div className="sidePage">
            <img className="exitButton" src={`${process.env.PUBLIC_URL}/assets/images/exit.png`} title={'Close Side Panel'} onClick={this.closeSidePage}/>
            <ReviewPage locData={this.state.locData.getLoc(this.state.currLocId)} backToLocPage={this.backToLocPage}/>
          </div>);
        }else{
            return (<div className="sidePage">
              <img className="exitButton" src={`${process.env.PUBLIC_URL}/assets/images/exit.png`} title={'Close Side Panel'} onClick={this.closeSidePage}/>
              <LocationPage locData={this.state.locData.getLoc(this.state.currLocId)} openUserPage={this.openUserPage} leaveReview={this.leaveReview}/>
            </div>);
        }

    } else {

      return;
    }
  }

  // Placeholder
  handleLoginAttempt(user, pass) {
    if (user === "admin" && pass === "admin") {
      this.setState({userLoggedIn: user});
      this.closeOverlay()
      return true;
    }
    else if (user === "user" && pass === "user") {
      this.setState({userLoggedIn: user});
      this.closeOverlay();
      return true;
    }
    return false;
  }
  

  renderOverlayPage() {
    if (this.state.overlayClass === "loginPage") {
      return (<div className="loginPage">
              <LoginPage closeHandler={this.closeOverlay} handleLoginAttempt={this.handleLoginAttempt}/>
            </div>);
    } else {
      return ;
    }
  }

  closeOverlay() {
    this.setState({overlayClass: "none"})
  }

  leaveReview = () => {
    this.setState({sidePageClass: "leaveReviewPage"});

  }
  backToLocPage = () => {
    this.setState({sidePageClass: "locPage"});

  }
  closeSidePage() {
    this.setState({currUserId: -1, mapClass: "fullMap", currLocId: -1});
    this.setState({sidePageClass: "locPage"});
  }

  handleLogin() {
    if (this.state.userLoggedIn === "") {
      this.setState({overlayClass: "loginPage"})
    } else {
      this.setState({userLoggedIn: ""})
    }
  }

  render() {
    return (
      <div>
          {this.renderSidePage()}
          {this.renderOverlayPage()}
          <div className={this.state.mapClass}>
          <button className = "searchButton purpleButton" onClick={this.openSearchPage}>Search</button>
          <SiteMap locations={this.state.locData.getGeoLocData()} openLocPage={this.openLocPage}/>
          <div id="loginButtonMain" className="purpleButton" onClick={this.handleLogin}>{(this.state.userLoggedIn === "") ? "Register/Login" : "Logout"}</div>
          </div>
      </div>

    );
  }

}

export default App;
