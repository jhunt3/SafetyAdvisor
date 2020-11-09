import React from 'react';
import StarRatings from 'react-star-ratings';

import TagIndicator from './../TagIndicator';
import { showDeleteButton } from './../../helperJS/userFunctionalityHelperFunctions';

import "./styles.css";

class LocationPage extends React.Component {

  generateTagIndicators(tags) {
    return tags.map((tag) => {return <TagIndicator
                                        name={tag.name}
                                        val={tag.val}
                                      />
    });
  }

  render() {
    return (
      <div className="body">
        <div id="addReviewButton" className="purpleButton" onClick={this.props.leaveReview}>+ Review</div>
        <img className="locImage" alt="locationImage" src={this.props.locData.imagePath}/>
        <div className="infoContainer">
          <div className="locationTitleContainer">
            <h1 id="nameHeader">{this.props.locData.name}</h1>
            <h3 id="venueHeader">{this.props.locData.venueType}</h3>
          </div>
          <div className="avgRatingsContainer">
            <StarRatings rating={this.props.locData.avgRating}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='1.5vw'
                        starSpacing='0.1vw'/>
            <h3 id="noRatings">({this.props.locData.numRatings} Ratings)</h3>
          </div>
          {this.generateTagIndicators(this.props.locData.tags.filter((tag) =>
              {return tag.val !== 0}))}
        </div>
        <div className="reviewsContainer">
        <h2 id="reviewHeader">Reviews</h2>
        {this.props.locData.reviews.map(review => (
            <div className="review">
                <div className="profileIconContainer">
                    <img className="profileIcon" alt="profileIcon" src={review.imagePath}/>
                </div>
                <div className="usernameContainer">
                    <p className="username" title={`Go to ${review.username}'s page`} onClick={() => {
                      this.props.openUserPage(review.username);
                    }}>{review.username}</p>
                </div>
                <div className="reviewRatingContainer">
                    <StarRatings rating={review.rating}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='1.5vw'
                        starSpacing='0.15vw'/>
                    {showDeleteButton(this.props.currentUser, review.username, this.props.locData.id, review.reviewId, this.props.deleteReview)}
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

export default LocationPage;
