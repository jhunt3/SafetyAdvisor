import React from 'react';

import "./styles.css";
import { withRouter } from "react-router-dom";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Venue Name'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.value === "Venue Name") {
      event.preventDefault();
      alert("Please enter a valid search query.");
      return;
    }
    this.props.history.push(`/search/${this.state.value}`);
  }

  render() {
    return(
        <div className="searchResultsFormContainer">
            <h2 id="searchHeader">Search for Venues</h2>
            <br></br>
            <form onSubmit={this.handleSubmit}>
                <input type="text" value={this.state.value} onChange={this.handleChange}/>
                <br></br>
                <br></br>
                <br></br>
                <input class="purpleButton searchButtonFormPage" type="submit" value="Submit" />
            </form>
        </div>
    )
  }   
}
export default withRouter(SearchForm);