import React from 'react';
import StarRatings from 'react-star-ratings';
import { withRouter } from "react-router-dom";
import { addImage } from "../../helperJS/imageHelper";
import TagIndicator from './../TagIndicator';
import { showDeleteButton } from './../../helperJS/userFunctionalityHelperFunctions';
import { showDeleteLocButton } from './../../helperJS/LocationData';

import "./styles.css";
import { checkSession } from '../../helperJS/loginHelper';

class LocationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state =  {
      currentUser: "",
      isAdmin: false,
      showForm: false,
      reviews: [],
      profileImageUrl: "/static/placeholder.jpg"
    }
    checkSession(this);
    this.updateProfileImage(this);
    this.getReviews(this);

    this.showChangePhotoForm = this.showChangePhotoForm.bind(this);
  }
  updateProfileImage(target) {
    const path = this.props.history.location.pathname.split('/')
    const locId = path[path.length - 1];
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
            target.setState({ profileImageUrl: json.image.image_url });
          }
        })
        .catch(error => {
            console.log(error);
        });
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

  generateTagIndicators(tags) {
    return tags.map((tag) => {return <TagIndicator
                                        tag={tag.tag}
                                        val={tag.val}
                                      />
    });
  }

  showChangePhotoForm() {
    this.setState({showForm: (this.state.showForm) ? false : true});
  }

  renderChangePictureButton(locId) {
    if (this.state.isAdmin) {
      return (
        <button id="showFormLoc" className='purpleButton' type="button" onClick={this.showChangePhotoForm}>Change Photo</button>
      );
    }
    return;
  }
  renderForm() {
    const path = this.props.history.location.pathname.split('/')
    const locId = path[path.length - 1];
    if (this.state.showForm) {
      return (<div id="changePhotoFormLoc">
        <form className="image-form" onSubmit={(e) => {
                  e.preventDefault();
                  addImage(this, e.target, locId, 'loc');
              }}>
          <div class="image-form__field">
              <label>Image:</label>
              <br/>
              <input id="locInputImage" name="image" type="file" />
          </div>
          <input type="submit" className="purpleButton loginPageButton" value="Upload"/>
        </form>
      </div>);
    }
    return;
  }

  formatName(string) {
    if (string.length > 15) {
      return string.slice(0, 14) + '...';
    }
    return string;
  }

  render() {
    const path = this.props.history.location.pathname.split('/')
    const locId = path[path.length - 1];
    const averageRating = (reviews) => {if (reviews.length > 0) {
        return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    } else {
        return 0
    }}
    const cumulativeTags = (reviews) => {if (reviews.length > 0) {
        reviews.map(review => (review.tags.map(indvtag => indvtag.val = (indvtag.val) ? 1 : 0)))
        const tagList = reviews.reduce( (result, review) => {return result.concat(review.tags)}, [])
        const sumTagList = Object.entries(tagList.reduce((result, tag) => {
            if(!result[tag.tag]) {
                result[tag.tag] = tag.val;
            } else {
                result[tag.tag] += tag.val;
            }
            return result}, {}))
        const finalResult = sumTagList.map(tag => ( {"tag": tag[0], "val": tag[1]/reviews.length * 100}))
        return finalResult
    } else {
        return [{"tag": "placeholder", "val": 0}]
    }};

    return (
      <div className="body">
        <div id="addReviewButton" className="purpleButton" onClick={() => {this.props.history.push(`/loc/${locId}/addReview`)}}>+ Review</div>
        <img className="locImage" alt="locationImage" src={this.state.profileImageUrl}/>
	<button className="backButton purpleButton" onClick={this.props.history.goBack}>Back</button>

        {this.renderChangePictureButton(locId)}
        {this.renderForm()}
        <div className="infoContainer">
          <div className="locationTitleContainer">
            <h1 id="nameHeader">{this.props.locData.getLoc(locId).name}{showDeleteLocButton(this.props.app, this.state.isAdmin, locId)}</h1>            <h3 id="venueHeader">{this.props.locData.getLoc(locId).venueType}</h3>
          </div>
          <div className="avgRatingsContainer">
            <StarRatings rating={averageRating(this.state.reviews)}
                        starRatedColor="grey"
                        starEmptyColor="darkgrey"
                        starDimension='1.5vw'
                        starSpacing='0.1vw'/>
            <h3 id="noRatings">{`(${this.state.reviews.length} Rating${(this.state.reviews.length !== 1) ? 's' : ''})`}</h3>
          </div>
          {this.generateTagIndicators(cumulativeTags(this.state.reviews).filter((tag) =>
          {return tag.val !== 0}))}
        </div>
        <div className="reviewsContainer">
        <h2 id="reviewHeader">Reviews</h2>
        {this.state.reviews.map(review => (
            <div className="review">
                <div className="reviewDataContainer">
                  <div className="profileIconContainer" title={`Go to ${review.username}'s page`} onClick={() => {
                        this.props.history.push(`/usr/${review.username}`);}}>
                    <img className="profileIcon" alt="profileIcon" src={review.usrImagePath}/>
                  </div>
                  <div className="reviewRatingContainer">
                      <StarRatings rating={review.rating}
                          starRatedColor="grey"
                          starEmptyColor="darkgrey"
                          starDimension='1.5vw'
                          starSpacing='0.15vw'/>
                      {showDeleteButton(this, this.state.isAdmin, this.state.currentUser, review.username, locId, review._id)}
                  </div>
                </div>
                <div className="reviewContainer">
                    {review.review}
                    <div className="username" title={`Go to ${review.username}'s page`} onClick={() => {
                        this.props.history.push(`/usr/${review.username}`);
                    }}>{`By: ${this.formatName(review.username)}`}</div>
                </div>
            </div>
        ))}

        </div>
      </div>
    );
  }

}

export default withRouter(LocationPage);
