/* New cleaned up version of App.js */
import React from 'react';

import { Route, Switch, withRouter, Link } from "react-router-dom";

import './App.css';
import LocationData from './helperJS/LocationData';
import UserData from './helperJS/UserData';
import { checkSession, logout } from "./helperJS/loginHelper";
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
    checkSession(this);
    this.state = {
      mapClass: "fullMap",
      currentUser: null,
      locData: new LocationData(),
      userData: new UserData(),
    };
    // Adds hardcoded location data
    this.state.locData.addLocation("Sidney Smith", "Lecture Hall", 43.663098, -79.398568, defaultTags);
    this.state.locData.addLocation("UofT Bookstore", "Store", 43.659213, -79.396960, defaultTags);
    this.state.locData.addLocation("Isabel Bader Theatre", "Theatre", 43.667246, -79.392524, defaultTags);

    this.state.locData.updateTags(0, [{name: defaultTags[4], val: 60}, {name: defaultTags[1], val: 95}, {name: defaultTags[0], val: 20}]);
    this.state.locData.updateTags(1, [{name: defaultTags[2], val: 42.5}, {name: defaultTags[3], val: 0.5}]);
    this.state.locData.updateTags(2, [{name: defaultTags[5], val: 100}]);

    this.state.userData.addUser("admin", "admin")
    this.state.userData.addUser("user", "js")
    this.state.userData.addUser("janedoe", "jd")

    this.state.userData.addReview(0, 1, 4.0, "Lots of hand sanitizer on hand!")
    this.state.userData.addReview(0, 2, 4.5, "Washrooms infrequently cleaned. Terrible, but I'll give a high rating for testing purposes.")
    this.state.locData.addReview(0, "user", 4.0, "Lots of hand sanitizer on hand!")
    this.state.locData.addReview(0, "janedoe", 4.5, "Washrooms infrequently cleaned. Terrible, but I'll give a high rating for testing purposes.")

    this.toggleMapClass = this.toggleMapClass.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  toggleMapClass() {
    this.setState({mapClass: (("sideMap" ===  this.state.mapClass) ? "fullMap" : "sideMap")});
  }

  deleteReview(username, locId, id) {
    const uid = this.state.userData.getUser(username).uid;
    this.setState({locData: this.state.locData.removeReview(locId, id),
                   userData: this.state.userData.removeReview(uid, id)
    });
  }

  deleteUser(username) {
    this.setState({userData: this.state.userData.removeUser(username, this.state.locData)});
  }

  renderExitButton() {
    return (
      <Link to={"/"}>
        <img className="exitButton" alt='exitButton' src={`${process.env.PUBLIC_URL}/assets/images/exit.png`} 
        title={'Close Side Panel'}/>
      </Link>);
  }

  // Placeholder
  handleLoginAttempt(user, pass) {
    if (user === "admin" && pass === "admin") {
      this.setState({userLoggedIn: user});
      return true;
    }
    else if (user === "user" && pass === "user") {
      this.setState({userLoggedIn: user});
      return true;
    }
    return false;
  }  

  leaveReview = () => {
    this.setState({sidePageClass: "leaveReviewPage"});

  }

  renderUserPageButton() {
    if (this.state.userLoggedIn !== "") {
      return (<div id="userPageButton" className="purpleButton" onClick={() => {this.openUserPage(this.state.userLoggedIn)}}>
        {`${this.state.userLoggedIn}'s Page`}
      </div>);
    }
    return;
  }

  renderLoginButton() {
    if (this.state.currentUser === null) {
      return (
        <Link to={"/login"}>
          <div id="loginButtonMain" className="purpleButton">Register/Login</div>
        </Link>
      );
    } 
    return (
      <div id="loginButtonMain" className="purpleButton" onClick={() => {logout(this)}}>Logout</div>
    );
  }

  render() {
    const path = this.props.history.location.pathname.split('/');
    return (
      <div>
        <Switch>
            { /* Login Page  */ } 
            <Route exact path="/login" render={ () => 
              <div className="loginPage">
                <LoginPage app={this}/>
              </div>
            }/>
            { /* Location Page  */ } 
            <Route exact path="/loc/:id" render={ () => 
              <div className="sidePage">
                {this.renderExitButton()}
                <LocationPage locData={this.state.locData} openUserPage={this.openUserPage} 
                leaveReview={this.leaveReview} currentUser={this.state.userLoggedIn} deleteReview={this.deleteReview}/>
              </div>
            }/>
            { /* Add Review Page  */ } 
            <Route exact path="/loc/:id/addReview" render={ () => 
              <div className="sidePage">
                {this.renderExitButton()}
                <ReviewPage locData={this.state.locData} currentUser={this.state.userLoggedIn}/>
              </div>
            }/>
            { /* User Page  */ } 
            <Route exact path="/usr/:id" render={ () => 
              <div className="sidePage">
                {this.renderExitButton()}
                <UserPage locData={this.state.locData} deleteReview={this.deleteReview} userData={this.state.userData}
              currentUser={this.state.userLoggedIn} deleteUser={this.deleteUser}/>
              </div>
            }/>
            { /* Search Query Page  */ } 
            <Route exact path="/search" render={ () => 
              <div className="sidePage">
              {this.renderExitButton()}
              <SearchForm setSearchResult={this.setSearchResult}/>
            </div>
            }/>
            { /* Search Results Page  */ } 
            <Route exact path="/search/:query" render={ () => 
              <div className="sidePage">
              {this.renderExitButton()}
              <SearchPage locData={this.state.locData}/>
            </div>
            }/>
        </Switch>
        { /* Map  */ } 
        <div className={(path[path.length - 1] === "" || path[path.length - 1] === 'login') ? "fullMap" : "sideMap"}>
          <Link to={"/search"}>
            <button className = "searchButton purpleButton">Search</button>
          </Link>
          <SiteMap locations={this.state.locData.getGeoLocData()} toggleMap={this.toggleMapClass}/>
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }

}

export default withRouter(App);
