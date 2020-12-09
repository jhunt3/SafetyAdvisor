import React from 'react';
import StarRatings from 'react-star-ratings';

import "./styles.css";
import { checkSession } from '../../helperJS/loginHelper';
import { withRouter } from "react-router-dom";

import { showAdminButton, showDeleteButton, showDeleteUserButton } from './../../helperJS/userFunctionalityHelperFunctions';

class UserPage extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      currentUser: "",
      isAdmin: false,
      reviews: []
    }
    checkSession(this);
    this.getReviews(this);
  }

  getReviews(target) {
    // Since this is a GET request, simply call fetch on the URL
    fetch(`/api${target.props.history.location.pathname}/reviewData`)
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
            target.setState({ reviews: json });
        })
        .catch(error => {
            console.log(error);
        });
};

  render() {
    console.log("USERPAGE ADMIN")	  
    console.log(this.state.isAdmin)
    const path = this.props.history.location.pathname.split('/')
    const userId = path[path.length - 1];
    return (
      <div className="body">
        <button className="backButton" onClick={this.props.history.goBack}>Back</button>
        {showAdminButton(this.props.app, this.state.isAdmin, this.state.currentUser, userId)}
        {showDeleteUserButton(this.props.app, this.state.isAdmin, userId)}

        <div className="userInfoContainer">
        <img className="profilePic" alt="profilePic" src=""/>
            <div className="userTitleContainer">
              <h1>{userId}</h1>
              <h3>{this.state.reviews.length} Reviews</h3>
            </div>
        </div>
        <div className="reviewsContainer">
            <h2>Reviews</h2>
            {this.state.reviews.map(review => (
                <div className="review">
                  <div className="reviewDataContainer">
                    <div className="profileIconContainer">
                        <img className="profileIcon" alt="profileIcon" src={review.locImagePath}/>
                    </div>
                    <div className="usernameContainer" title={`Go to ${this.props.locData.getLoc(review.locId).name}'s page`} onClick={() => {
                        this.props.history.push(`/loc/${review.locId}`);
                      }}>
                      <span className="username">{this.props.locData.getLoc(review.locId).name}</span>
                    </div>
                    <div className="reviewRatingContainer">
                        <StarRatings rating={review.rating}
                            starRatedColor="grey"
                            starEmptyColor="darkgrey"
                            starDimension='1.5vw'
                            starSpacing='0.15vw'/>
                        {showDeleteButton(this, this.state.isAdmin, this.state.currentUser, this.props.userData.getUser(userId).username , review.location_id, review.reviewId)}
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
