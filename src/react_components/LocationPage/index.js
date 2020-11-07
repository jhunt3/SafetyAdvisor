import React from 'react';
import StarRatings from 'react-star-ratings';

import TagIndicator from './../TagIndicator';

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
        <img className="locImage" src={this.props.locData.imagePath}/>
        <div className="infoContainer">
          <div className="titleContainer">
            <h1 id="nameHeader">{this.props.locData.name}</h1>
            <h3 id="venueHeader">{this.props.locData.venueType}</h3>
            <p id="reviewLink" onClick={this.props.leaveReview}>Leave Review</p>
          </div>
          <div className="avgRatingsContainer">
            <StarRatings rating={this.props.locData.avgRating}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='2vw'
                        starSpacing='0.2vw'/>
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
                    <img className="profileIcon" src={review.imagePath}/>
                </div>
                <div className="usernameContainer">
                    <a className="username" title={`Go to ${review.username}'s page`} onClick={() => {
                      this.props.openUserPage(review.username);
                    }}>{review.username}</a>
                </div>
                <div className="reviewRatingContainer">
                    <StarRatings rating={review.rating}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='1.5vw'
                        starSpacing='0.15vw'/>
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
