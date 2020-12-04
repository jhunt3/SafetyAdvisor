/* New cleaned up version of App.js */
import React from 'react';

import { Route, Switch, withRouter, Link } from "react-router-dom";

import './App.css';
import { getLocations } from './helperJS/LocationData';
import UserData from './helperJS/UserData';
import { checkSession, logout } from "./helperJS/loginHelper";
import SiteMap from './react_components/SiteMap';
import LocationPage from './react_components/LocationPage';
import UserPage from './react_components/UserPage';
import SearchPage from './react_components/Search/searchPage';
import SearchForm from './react_components/Search/searchFormPage';
import ReviewPage from './react_components/ReviewPage'
import LoginPage from './react_components/LoginPage'


export class App extends React.Component {
  constructor(props) {
    super(props);
    checkSession(this);
    this.state = {
      mapClass: "fullMap",
      currentUser: null,
      isAdmin: false,
      locData: null,
      userData: new UserData(),
    };
    // Adds hardcoded location data
    getLocations(this);

    this.state.userData.addUser("admin", "admin")
    this.state.userData.addUser("user", "js")
    this.state.userData.addUser("janedoe", "jd")

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
        <img className="exitButton" alt='exitButton' src={`/static/exit.png`} 
        title={'Close Side Panel'}/>
      </Link>);
  }

  renderUserPageButton() {
    if (this.state.currentUser !== null) {
      return (
      <Link to={`/usr/${this.state.currentUser}`}>
        <div id="userPageButton" className="purpleButton">
          {`${this.state.currentUser}'s Page`}
        </div>
      </Link>
      );
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
    if (this.state.locData === null) {
      return null;
    }
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
                <LocationPage locData={this.state.locData} app={this}/>
              </div>
            }/>
            { /* Add Review Page  */ } 
            <Route exact path="/loc/:id/addReview" render={ () => 
              <div className="sidePage">
                {this.renderExitButton()}
                <ReviewPage locData={this.state.locData}/>
              </div>
            }/>
            { /* User Page  */ } 
            <Route exact path="/usr/:id" render={ () => 
              <div className="sidePage">
                {this.renderExitButton()}
                <UserPage locData={this.state.locData} userData={this.state.userData}/>
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
          {this.renderUserPageButton()}
        </div>
      </div>
    );
  }

}

export default withRouter(App);
