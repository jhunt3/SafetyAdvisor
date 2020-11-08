import React from 'react';
import StarRatings from 'react-star-ratings';

import "./styles.css";

class UserPage extends React.Component {

  render() {
    return (
      <div className="body">
        <img className="profilePic" src={this.props.userData.imagePath}/>

        <div className="userInfoContainer">
            <div className="userTitleContainer">
              <h1>{this.props.userData.username}</h1>
              <h3>{this.props.userData.reviews.length} Review</h3>
            </div>
        </div>
        <div className="reviewsContainer">
            <h2>Reviews</h2>
            {this.props.userData.reviews.map(review => (
                <div className="review">
                    <div className="profileIconContainer">
                        <img className="profileIcon" src={this.props.locData[review.location_id].imagePath}/>
                    </div>
                    <div className="usernameContainer">
                        <strong>{this.props.locData[review.location_id].name}</strong>
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

export default UserPage;