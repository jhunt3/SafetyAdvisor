import React from 'react';
import { withRouter } from "react-router-dom";
import StarRatingComponent from 'react-star-rating-component';
import { checkSession } from '../../helperJS/loginHelper';

import { defaultTags } from '../../helperJS/LocationData';

import ButtonTagIndicator from './../ButtonTagIndicator';

import "./styles.css";

class ReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.path = this.props.history.location.pathname.split('/');
    this.locId = this.path[this.path.length - 2];

    this.state = {
      currentUser: "",
      isAdmin: false,
      rating: 1,
      locImagePath: '/static/placeholder.jpg',
      usrImagePath: "/static/profile.png",
      locReviews: [],
      review: ""
    };

    checkSession(this);
    this.updateLocationImage(this);
    this.updateReviews(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTags = this.handleChangeTags.bind(this);
    this.handleChangeReview = this.handleChangeReview.bind(this);
  }

  updateLocationImage(target) {
    // Since this is a GET request, simply call fetch on the URL
    fetch(`/images/${this.locId}`)
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
            target.setState({ locImagePath: json.image.image_url });
          }
        })
        .catch(error => {
            console.log(error);
        });
  }

  updateProfileImage(target) {
    // Since this is a GET request, simply call fetch on the URL
    if (this.state.currentUser === "") {
      return;
    }

    // Since this is a GET request, simply call fetch on the URL
    fetch(`/images/${this.state.currentUser}`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get image");
            }
        })
        .then((json) => {
          // the resolved promise with the JSON body
          target.setState({ usrImagePath: json.image.image_url });
        })
        .catch(error => {
            console.log(error);
        });
  }

  updateReviews(target) {
      // get numRatings and avgRating
      fetch(`/api/loc/${this.locId}/reviewData`)
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
              target.setState({ locReviews: json });
          })
          .catch(error => {
              console.log(error);
          });

  }
  handleChangeTags() {
    console.log(this.state.tags.map((tag) => {
      if (document.getElementById(`buttonTagIndicator${tag.tag}`).checked) {
        return {
          tag: tag.tag,
          val: true
        };
      }
      return tag;
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.currentUser === "") {
      alert("You must login to submit a review.");
      return;
    }

    const tags = defaultTags.map((tagName) => {
      if (document.getElementById(`buttonTagIndicator${tagName}`).checked) {
        return {
          tag: tagName,
          val: true
        };
      }
      return {
        tag: tagName,
        val: false
      };
    });

    const reqObj = this.state;
    reqObj.tags = tags;

    const request = new Request(`/api/loc/${this.locId}/addReview`, {
      method: "post",
      body: JSON.stringify(reqObj),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    });
    // Send the request with fetch()
    await fetch(request)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then((json) => {
          if (json) {
            alert("Review posted.")
            this.props.history.push(`/loc/${this.locId}`);
          }
        })
        .catch((error) => {
            alert("Review submission failed.");
            console.log(error);
        });

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
        const finalResult = sumTagList.map(tag => ( {"tag": tag[0], "val": tag[1]}))
        return finalResult
    }}

    console.log(this.state.locReviews);
    console.log(averageRating(this.state.locReviews));
    console.log(cumulativeTags(this.state.locReviews));

    const updatedState = this.state.locReviews.concat(reqObj)
    console.log(reqObj)
    const patchObj = {
        "avgRating": averageRating(updatedState),
        "numRatings": updatedState.length,
        "tags": cumulativeTags(updatedState)};

    console.log("check the patch");
    console.log(patchObj);

    const patchReq = new Request(`/api/loc/${this.locId}`, {
      method: "PATCH",
      body: JSON.stringify(patchObj),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    });

    // Send the request with fetch()
    await fetch(patchReq)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        })
        .catch((error) => {
            alert("Review submission failed.");
            console.log(error);
        });


    return;


  }



  generateButtonTagIndicators(tags) {
    return tags.map((tag) => {return <ButtonTagIndicator
                                        name={tag.tag}
                                        val={tag.val}
                                      />
    });
  }

  handleChangeReview(e) {
    this.setState({review: e.target.value});
  }

  render() {
    this.updateProfileImage(this);
    const { rating } = this.state;
    return (
      <div className="body">
        <img className="locImage" alt="locationImage" src={this.state.locImagePath}/>
        <button className="backButton purpleButton" onClick={this.props.history.goBack}>Back</button>
        <div className="infoContainer">
          <div className="titleContainer">
            <h1 id="nameHeader">{this.props.locData.getLoc(this.locId).name}</h1>
            <h3 id="venueHeader">{this.props.locData.getLoc(this.locId).venueType}</h3>
          </div>
          <div className="ratingsContainer">

        <StarRatingComponent
          name="rate1"
          starCount={5}
          starColor={"grey"}
          emptyStarColor={"darkgrey"}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
        />

          </div>
          <p className="reviewPageText">Please select safety features present</p>
          {this.generateButtonTagIndicators(this.props.locData.getLoc(this.locId).tags)}
        </div>
        <p id="commentHeader" className="reviewPageText">Comments:</p>
      <form className="comment" onSubmit={this.handleSubmit}>
        <label>
          <textarea className="commentText" type="text" value={this.state.value} onChange={this.handleChangeReview} />        </label>
          <br></br>
        <input id="submitButton" className="purpleButton" type="submit" value="Submit" />
      </form>
      </div>
    );
  }
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }

}

export default withRouter(ReviewPage);
