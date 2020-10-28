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
            <h1>{this.props.locData.name}</h1>
            <h3>{this.props.locData.venueType}</h3>
          </div>
          <div className="avgRatingsContainer">
            <StarRatings rating={this.props.locData.avgRating}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='30px'
                        starSpacing='10px'/>
            <h3>({this.props.locData.numRatings} Ratings)</h3>
          </div>
          {this.generateTagIndicators(this.props.locData.tags.filter((tag) =>
              {return tag.val !== 0}))}
        </div>
        <div className="reviewsContainer">
        <h2>Ratings</h2>
        {this.props.locData.reviews.map(review => (
            <div className="review">
                <div className="profileIconContainer">
                    <img className="profileIcon" src={review.imagePath}/>
                </div>
                <div className="usernameContainer">
                    <strong>{review.username}</strong>
                </div>
                <div className="reviewRatingContainer">
                    <StarRatings rating={review.rating}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='20px'
                        starSpacing='2px'/>
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
