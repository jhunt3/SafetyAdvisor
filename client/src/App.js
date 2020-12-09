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
import AddLocation from './react_components/AddLocation'



export class App extends React.Component {
  constructor(props) {
    super(props);
    checkSession(this);
    this.showMarker = this.showMarker.bind(this)
    this.state = {
      mapClass: "fullMap",
      currentUser: null,
      isAdmin: false,
      locData: null,
      userData: new UserData(),
      sidePage: null,
      lat: null,
      lng: null
    };
    // Adds hardcoded location data
    getLocations(this);
    console.log("Received State")
    console.log(this.state.locData)
    this.state.userData.addUser("admin", "admin")
    this.state.userData.addUser("user", "js")
    this.state.userData.addUser("janedoe", "jd")

    this.toggleMapClass = this.toggleMapClass.bind(this);
    this.deleteReview = this.deleteReview.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.setNewLoc = this.setNewLoc.bind(this);
    this.addLocation = this.addLocation.bind(this);

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
        <img className="exitButton" alt='exitButton' onClick={(e) => {this.showMarker(null); this.state.sidePage = null}} src={`/static/exit.png`} 
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

  renderAddLocButton(){
	if (this.state.isAdmin === true){
	
	return (
      <Link to={`/addLocation`}>
        <div id="addLocButton" onClick={() =>{this.state.sidePage = 'addLocation'}} className="purpleButton">
          Add Location
        </div>
      </Link>
      );
	}
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
  showMarker(query){
    let LD = this.state.locData
    console.log("QUERY")
    console.log(query)
    if (query == null){
    for (let i in LD.locations) {

	LD.locations[i].show = 10;
    }
    return
    }
    //console.log(LD)
    for (let i in LD.locations) {
      const locationNameLowercase = LD.locations[i].name.toLowerCase();
      if (locationNameLowercase.includes(query.toLowerCase())) {
        LD.locations[i].show = 32;
      }else{LD.locations[i].show = 10;}
    }
    //console.log(LD)
    this.setState({locData: LD})	   
 }
 addLocation(name, type){
   console.log("Add location data")
   this.setState({sidePage: null})
   console.log(name, type, this.state.lat, this.state.lng)
   this.state.locData.addLocation(name, type, this.state.lat, this.state.lng)
 }
 setNewLoc(lat,lng){
   this.setState({lat: lat, lng: lng})
 }

  render() {
    let map_locations = null;
    if (this.state.locData !== null) {
       map_locations = this.state.locData.getGeoLocData();
    }
    console.log("APP RENDER")
    console.log(this.state.isAdmin)

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
                <UserPage locData={this.state.locData} userData={this.state.userData} app={this}/>
              </div>
            }/>
            { /* Search Query Page  */ } 
            <Route exact path="/search" render={ () => 
              <div className="sidePage">
              {this.renderExitButton()}
              <SearchForm setSearchResult={this.setSearchResult} showMarker = {this.showMarker}/>
            </div>
            }/>
            { /* Search Results Page  */ } 
            <Route exact path="/search/:query" render={ () => 
              <div className="sidePage">
              {this.renderExitButton()}
              <SearchPage locData={this.state.locData} />
            </div>
            }/>
	    { /* Add Location Page */ }
            <Route exact path="/addLocation" render={ () => 
              <div className="sidePage">
              {this.renderExitButton()}
              <AddLocation lat = {this.state.lat} lng = {this.state.lng} addLocation={this.addLocation} />
            </div>
            }/>

        </Switch>
        { /* Map  */ } 
        <div className={(path[path.length - 1] === "" || path[path.length - 1] === 'login') ? "fullMap" : "sideMap"}>
          <Link to={"/search"}>
            <button className = "searchButton purpleButton">Search</button>
          </Link>
	    
          <SiteMap setNewLoc = {this.setNewLoc} is_Admin = {this.state.isAdmin} sidePage= {this.state.sidePage} locations={map_locations} toggleMap={this.toggleMapClass}/>
          {this.renderLoginButton()}
          {this.renderUserPageButton()}
	  {this.renderAddLocButton()}
        </div>
      </div>
    );
  }

}

export default withRouter(App);
