import React from 'react';
import { withRouter } from "react-router-dom";
import StarRatings from 'react-star-ratings';
import TagIndicator from '../TagIndicator';

import "./styles.css";

class SearchPage extends React.Component {
  constructor(props) {
      super(props);
      const path = this.props.history.location.pathname.split('/');
      const query = path[path.length - 1];
      this.locData = this.props.locData.getLocationsWithQuery(query);
      this.state = {};
    }

    componentDidMount() {
      this.locData.forEach((val) => {
          const returnObj = {}
          returnObj[val._id] = "/static/placeholder.jpg";
          this.setState(returnObj);
          this.updateLocImage(this, val._id);
      });
    }

  generateTagIndicators(tags, numRatings) {
    return tags.map((tag) => {return <TagIndicator
                                        tag={tag.tag}
                                        val={tag.val/numRatings * 100}
                                        />
    });
  }

  updateLocImage(target, locId) {
    const url = `/images/${locId}`;

    // Since this is a GET request, simply call fetch on the URL
    fetch(url)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get image");
            }
        })
        .then((json) => {
          // the resolved promise with the JSON body
          if (json.image) {
            const returnObj = {};
            returnObj[locId] = json.image.image_url;
            target.setState(returnObj);
          }
        })
        .catch(error => {
            console.log(error);
        });
  }

  generateSearchResults() {
      if (this.locData.length === 0) {
        return <h4>No results found.</h4>;
      }
      return (this.locData.map(location => (
        <div className="review">
            <div className="reviewInfoContainer">

                <img className="searchLocImage" alt="searchLocationImage" src={this.state[location._id]}/>

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
                    {return tag.val !== 0}), location.numRatings)}
            </div>

        </div>

    )));
  }

  render() {
    return(
      <div className="body">
        <div className="searchResultsContainer">
            <h2 id="resultsHeader">Results</h2>
            <button className="backButton purpleButton" onClick={this.props.history.goBack}>Back</button>
            {this.generateSearchResults()}
        </div>
      </div>
    )
  }
}
export default withRouter(SearchPage);
