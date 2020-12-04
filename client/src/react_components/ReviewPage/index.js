import React from 'react';
import { withRouter } from "react-router-dom";
import StarRatingComponent from 'react-star-rating-component';

import ButtonTagIndicator from './../ButtonTagIndicator';

import "./styles.css";

class ReviewPage extends React.Component {
    constructor() {
    super();

    this.state = {
      rating: 1,
      review: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeReview = this.handleChangeReview.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.currentUser === "") {
      alert("You must login to submit a review.");
      return;
    }
    const path = this.props.history.location.pathname.split('/')
    const locId = path[path.length - 2];
    console.log(locId);
    console.log(JSON.stringify(this.state));
    const request = new Request(`/api/loc/${locId}/addReview`, {
      method: "post",
      body: JSON.stringify(this.state),
      headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
      }
    });
    // Send the request with fetch()
    fetch(request)
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
    const { rating } = this.state;
    const path = this.props.history.location.pathname.split('/')
    const locId = path[path.length - 2];
    return (
      <div className="body">
        <img className="locImage" alt="locationImage" src={this.props.locData.getLoc(locId).imagePath}/>
        <button className="backButton" onClick={this.props.history.goBack}>Back</button>
        <div className="infoContainer">
          <div className="titleContainer">
            <h1 id="nameHeader">{this.props.locData.getLoc(locId).name}</h1>
            <h3 id="venueHeader">{this.props.locData.getLoc(locId).venueType}</h3>
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
          {this.generateButtonTagIndicators(this.props.locData.getLoc(locId).tags)}
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
