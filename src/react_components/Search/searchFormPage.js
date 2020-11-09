import React from 'react';

import "./styles.css";

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
    this.props.setSearchResult(this.state.value);
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
export default SearchForm;