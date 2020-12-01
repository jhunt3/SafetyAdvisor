import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

import ButtonTagIndicator from './../ButtonTagIndicator';

import "./styles.css";

class ReviewPage extends React.Component {
    constructor() {
    super();

    this.state = {
      rating: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.currentUser === "") {
      alert("You must login to submit a review.");
      return;
    }
    alert("Review submission not implemented.");
  }

  generateButtonTagIndicators(tags) {
    return tags.map((tag) => {return <ButtonTagIndicator
                                        name={tag.name}
                                        val={tag.val}
                                      />
    });
  }

  render() {
    const { rating } = this.state;
    return (
      <div className="body">
        <img className="locImage" alt="locationImage" src={this.props.locData.imagePath}/>
        <button className="backButton" onClick={this.props.backToLocPage}>Back</button>
        <div className="infoContainer">
          <div className="titleContainer">

            <h1 id="nameHeader">{this.props.locData.name}</h1>
            <h3 id="venueHeader">{this.props.locData.venueType}</h3>
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
          {this.generateButtonTagIndicators(this.props.locData.tags)}
        </div>
        <p id="commentHeader" className="reviewPageText">Comments:</p>
      <form className="comment" onSubmit={this.handleSubmit}>
        <label>
          <textarea className="commentText" type="text" value={this.state.value} onChange={this.handleChange} />        </label>
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

export default ReviewPage;
