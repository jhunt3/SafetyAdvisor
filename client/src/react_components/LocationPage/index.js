import React from 'react';
import StarRatings from 'react-star-ratings';
import { withRouter } from "react-router-dom";

import TagIndicator from './../TagIndicator';
import { showDeleteButton } from './../../helperJS/userFunctionalityHelperFunctions';

import "./styles.css";

class LocationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      reviews: []
    }
  }

  getReviews() {
    // Since this is a GET request, simply call fetch on the URL
    fetch(`${this.props.history.location.pathname}/reviewData`)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } else {
                alert("Could not get reviews");
            }
        })
        .then((json) => {
            // the resolved promise with the JSON body
            this.setState({ reviews: json });
        })
        .catch(error => {
            console.log(error);
        });
};

  generateTagIndicators(tags) {
    return tags.map((tag) => {return <TagIndicator
                                        name={tag.name}
                                        val={tag.val}
                                      />
    });
  }

  render() {
    const path = this.props.history.location.pathname.split('/')
    const locId = path[path.length - 1];
    return (
      <div className="body">
        <div id="addReviewButton" className="purpleButton" onClick={() => {this.props.history.push(`/loc/${locId}/addReview`)}}>+ Review</div>
        <img className="locImage" alt="locationImage" src={this.props.locData.getLoc(locId).imagePath}/>
        <div className="infoContainer">
          <div className="locationTitleContainer">
            <h1 id="nameHeader">{this.props.locData.getLoc(locId).name}</h1>
            <h3 id="venueHeader">{this.props.locData.getLoc(locId).venueType}</h3>
          </div>
          <div className="avgRatingsContainer">
            <StarRatings rating={this.props.locData.getLoc(locId).avgRating}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='1.5vw'
                        starSpacing='0.1vw'/>
            <h3 id="noRatings">({this.props.locData.getLoc(locId).numRatings} Ratings)</h3>
          </div>
          {this.generateTagIndicators(this.props.locData.getLoc(locId).tags.filter((tag) =>
              {return tag.val !== 0}))}
        </div>
        <div className="reviewsContainer">
        <h2 id="reviewHeader">Reviews</h2>
        {this.state.reviews.map(review => (
            <div className="review">
                <div className="reviewDataContainer">
                  <div className="profileIconContainer">
                    <img className="profileIcon" alt="profileIcon" src={review.imagePath}/>
                  </div>
                  <div className="usernameContainer"  title={`Go to ${review.username}'s page`} onClick={() => {
                        this.props.history.push(`/usr/${review.username}`);
                      }}>
                      <span className="username">{review.username}</span>
                  </div>
                  <div className="reviewRatingContainer">
                      <StarRatings rating={review.rating}
                          starRatedColor="grey"
                          starEmptyColor="darkgrey"
                          starDimension='1.5vw'
                          starSpacing='0.15vw'/>
                      {showDeleteButton(this.props.currentUser, review.username, locId, review.reviewId, this.props.deleteReview)}
                  </div>
                </div>
                <div className="reviewContainer">
                    {review.review}
                </div>
            </div>
        ))}

        </div>
      </div>
    );
  }

}

export default withRouter(LocationPage);
