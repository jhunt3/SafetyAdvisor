import React from 'react';
import StarRatings from 'react-star-ratings';

import "./styles.css";
import { withRouter } from "react-router-dom";
import { showDeleteButton, showDeleteUserButton } from './../../helperJS/userFunctionalityHelperFunctions';

class UserPage extends React.Component {

  render() {
    const path = this.props.history.location.pathname.split('/')
    const userId = path[path.length - 1];
    return (
      <div className="body">
        <button className="backButton" onClick={this.props.history.goBack}>Back</button>
        {showDeleteUserButton(this.props.currentUser, this.props.userData.getUser(userId).username, this.props.deleteUser)}
        <div className="userInfoContainer">
        <img className="profilePic" alt="profilePic" src={this.props.userData.getUser(userId).imagePath}/>  
            <div className="userTitleContainer">
              <h1>{this.props.userData.getUser(userId).username}</h1>
              <h3>{this.props.userData.getUser(userId).reviews.length} Review</h3>
            </div>
        </div>
        <div className="reviewsContainer">
            <h2>Reviews</h2>
            {this.props.userData.getUser(userId).reviews.map(review => (
                <div className="review">
                  <div className="reviewDataContainer">
                    <div className="profileIconContainer">
                        <img className="profileIcon" alt="profileIcon" src={this.props.locData.locations[review.location_id].imagePath}/>
                    </div>
                    <div className="usernameContainer" title={`Go to ${this.props.locData.locations[review.location_id].name}'s page`} onClick={() => {
                        this.props.history.push(`/loc/${review.location_id}`);
                      }}>
                      <span className="username">{this.props.locData.locations[review.location_id].name}</span>
                    </div>
                    <div className="reviewRatingContainer">
                        <StarRatings rating={review.rating}
                            starRatedColor="grey"
                            starEmptyColor="darkgrey"
                            starDimension='1.5vw'
                            starSpacing='0.15vw'/>
                        {showDeleteButton(this.props.currentUser, this.props.userData.getUser(userId).username , review.location_id, review.reviewId, this.props.deleteReview)}
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

export default withRouter(UserPage);
