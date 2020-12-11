/* New cleaned up version of App.js */
import React from 'react';

import { Route, Switch, withRouter, Link } from "react-router-dom";

import './App.css';
import { getLocations } from './helperJS/LocationData';
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
      sidePage: null,
      lat: null,
      lng: null
    };
    // Adds location data
    getLocations(this);

    this.toggleMapClass = this.toggleMapClass.bind(this);
    this.setNewLoc = this.setNewLoc.bind(this);
    this.addLocation = this.addLocation.bind(this);
  }

  toggleMapClass() {
    this.setState({mapClass: (("sideMap" ===  this.state.mapClass) ? "fullMap" : "sideMap")});
  }

  renderExitButton() {
    return (
      <Link to={"/"}>
        <img className="exitButton" alt='exitButton' onClick={(e) => {this.showMarker(null); this.setState({sidePage: null, lat:null, lng:null}); }} src={`/static/exit.png`}
        title={'Close Side Panel'}/>
      </Link>);
  }

  renderUserPageButton() {
    if (this.state.currentUser !== null) {
      return (
      <Link to={`/usr/${this.state.currentUser}`}>
        <div id="userPageButton" onClick={() =>{this.setState({sidePage: null, lat:null, lng:null});}} className="purpleButton">
          {`${this.state.currentUser}'s Page`}
        </div>
      </Link>
      );
    }
    return;
  }

  renderAddLocButton(){
    if (this.state.isAdmin === true && this.state.currentUser !== null){
      if (this.props.history.location.pathname === '/addLocation') {
        return (
          <Link to={`/`}>
            <div id="addLocButton" onClick={() =>{this.setState({sidePage: null, lat:null, lng:null});}} className="purpleButton">
              Add Location
            </div>
          </Link>
        );
      }
      return (
          <Link to={`/addLocation`}>
            <div id="addLocButton" onClick={() =>{this.setState({sidePage: 'addLocation'});}} className="purpleButton">
              Add Location
            </div>
          </Link>
      );
    }
  }

  renderSearchButton(){
  if (this.props.history.location.pathname === '/search') {
    return (
      <Link to={"/"}>
        <button className = "searchButton purpleButton" onClick={() =>{this.setState({sidePage: null, lat:null, lng:null});}}>Search</button>
      </Link>
    );
  }
  return (
    <Link to={"/search"}>
      <button className = "searchButton purpleButton" onClick={() =>{this.setState({sidePage: null, lat:null, lng:null});}}>Search</button>
    </Link>
  );
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
      <div id="loginButtonMain" className="purpleButton" onClick={() => {logout(this);this.setState({sidePage: null, lat:null, lng:null});}}>Logout</div>
    );
  }
  showMarker(query){
    let LD = this.state.locData
    if (query == null){
      for (let i in LD.locations) {
	    LD.locations[i].show = 32;
    }
    return
    }
    //console.log(LD)
    for (let i in LD.locations) {
      const locationNameLowercase = LD.locations[i].name.toLowerCase();
      if (locationNameLowercase.includes(query.toLowerCase())) {
        LD.locations[i].show = 32;
      } else {
        LD.locations[i].show = 10;
      }
    }
    //console.log(LD)
    this.setState({locData: LD})
 }
 addLocation(name, type){
  if (this.state.currentUser && this.state.isAdmin) {
    this.setState({sidePage: null});
    this.state.locData.addLocation(name, type, this.state.lat, this.state.lng)
    this.props.history.push(`/`);
    window.location.reload(false);
  }
  else {
    alert("You are not authorized to add a location.");
  }
 }
 setNewLoc(lat,lng){
   this.setState({lat: lat, lng: lng})
 }

  renderAddLocation() {
  if (this.state.currentUser && this.state.isAdmin) {
    return <AddLocation lat = {this.state.lat} lng = {this.state.lng} addLocation={this.addLocation} />;
  }
  this.props.history.push('/');
  return;
  }

  render() {
    let map_locations = null;
    if (this.state.locData !== null) {
       map_locations = this.state.locData.getGeoLocData();
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
                <UserPage locData={this.state.locData} app={this}/>
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
              {this.renderAddLocation()}
            </div>
            }/>

        </Switch>
        { /* Map  */ }
        <div className={(path[path.length - 1] === "" || path[path.length - 1] === 'login') ? "fullMap" : "sideMap"}>
          {this.renderSearchButton()}
          <SiteMap setNewLoc = {this.setNewLoc} lat={this.state.lat} lng = {this.state.lng} isAdmin = {this.state.isAdmin} sidePage= {this.state.sidePage} locations={map_locations} toggleMap={this.toggleMapClass}/>
          {this.renderLoginButton()}
          {this.renderUserPageButton()}
	      {this.renderAddLocButton()}
        </div>
      </div>
    );
  }

}

export default withRouter(App);
