import React from 'react';
import StarRatings from 'react-star-ratings';

import "./styles.css";
import { showDeleteButton, showDeleteUserButton } from './../../helperJS/userFunctionalityHelperFunctions';

class UserPage extends React.Component {

  render() {
    return (
      <div className="body">
        <button className="backButton" onClick={this.props.backToLocPage}>Back</button>
        {showDeleteUserButton(this.props.currentUser, this.props.userData.username, this.props.deleteUser)}
        <img className="profilePic" alt="profilePic" src={this.props.userData.imagePath}/>
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
                  <div className="reviewDataContainer">
                    <div className="profileIconContainer">
                        <img className="profileIcon" alt="profileIcon" src={this.props.locData[review.location_id].imagePath}/>
                    </div>
                    <div className="usernameContainer" title={`Go to ${this.props.locData[review.location_id].name}'s page`} onClick={() => {
                        this.props.openLocPage(review.location_id);
                      }}>
                      <span className="username">{this.props.locData[review.location_id].name}</span>
                    </div>
                    <div className="reviewRatingContainer">
                        <StarRatings rating={review.rating}
                            starRatedColor="grey"
                            starEmptyColor="darkgrey"
                            starDimension='1.5vw'
                            starSpacing='0.15vw'/>
                        {showDeleteButton(this.props.currentUser, this.props.userData.username , review.location_id, review.reviewId, this.props.deleteReview)}
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

export default UserPage;
