import React from 'react';
import { withRouter } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import TagIndicator from '../TagIndicator';

import "./styles.css";

class SearchPage extends React.Component {

  generateTagIndicators(tags) {
    return tags.map((tag) => {return <TagIndicator
                                        name={tag.tag}
                                        val={tag.val}
                                        />
    });
  }

  generateSearchResults() {
      const path = this.props.history.location.pathname.split('/');
      const query = path[path.length - 1];
      const locData = this.props.locData.getLocationsWithQuery(query);

      if (locData.length === 0) {
        return <h4>No results found.</h4>;
      }
      return (locData.map(location => (
        <div className="review">
            <div className="reviewInfoContainer">

                <img className="searchLocImage" alt="searchLocationImage" src={location.imagePath}/>

                <div className="titleContainer">

                    <p className="resultTitle" onClick={() => {
                    this.props.history.push(`/loc/${location._id}`);
                    }}>{location.name}</p>
                    <h3 className="resultSubtitle">{location.venueType}</h3>
                </div>
                <div className="avgRatingsContainer">
                    <StarRatings rating={location.avgRating}
                                starRatedColor="grey"
                                starEmptyColor="darkgrey"
                                starDimension='1.5vw'
                                starSpacing='0.15vw'/>
                    <h3 className="resultSubtitle">({location.numRatings} Ratings)</h3>
                </div>
                {this.generateTagIndicators(location.tags.filter((tag) =>
                    {return tag.val !== 0}))}
            </div>

        </div>

    )));
  }

  render() {
    return(
        <div className="searchResultsContainer">
            <h2 id="resultsHeader">Results</h2>
            <button className="backButton" onClick={this.props.history.goBack}>Back</button>
            {this.generateSearchResults()}
        </div>
    )
  }
}
export default withRouter(SearchPage);
