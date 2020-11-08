import React from 'react';

import "./styles.css";

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Search'
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
        <div className="searchResultsContainer">
            <h2>Search</h2>
            <form onSubmit={this.handleSubmit}>
                <label>
                Name:
                <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
  }   
}
export default SearchForm;