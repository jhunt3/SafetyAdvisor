import React from 'react';
import { checkSession } from '../../helperJS/loginHelper';

import "./styles.css";
import { withRouter } from "react-router-dom";


class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      type: '',
      isAdmin: false
    };
    checkSession(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
   
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleNameChange(event){
	this.setState({name: event.target.value});
  }
  handleTypeChange(event){
	this.setState({type: event.target.value});
  }

  handleSubmit(event) {
	console.log("state")
	if(this.state.name === '' || this.state.type === ''){
		event.preventDefault();
		alert("Please enter valid location descriptions.");
		return
	}
	if(this.props.lat === null){
		event.preventDefault();
		alert("Please place a marker on the map");
		return
	}

	this.props.addLocation(this.state.name,this.state.type)
	this.props.history.push(`/`)
	console.log("STATE")
	console.log(this.state.name)

  }

  render() {
    const el = document.getElementById('googlemap');
    console.log('map element');
    console.log(el);
    return(
      <div className="AddLocationForm">
          <h2 id="searchHeader">Add Location</h2>
          <br></br>
          <form id = "addLocForm" onSubmit={this.handleSubmit}>
        <label>Venue Name: </label><br/>
              <input type="text" value={this.state.name} onChange={this.handleNameChange}/><br/>
      <label>Venue Type: </label><br/>
        <input type="text" value={this.state.type} onChange={this.handleTypeChange}/><br/>
              <input class="purpleButton " type="submit" value="Submit" />
          </form>
      </div>
  );
  }   
}
export default withRouter(AddLocation);
