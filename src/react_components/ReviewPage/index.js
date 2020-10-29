import React from 'react';
import ReactDOM from 'react-dom';
import StarRatingComponent from 'react-star-rating-component';

import ButtonTagIndicator from './../ButtonTagIndicator';

import "./styles.css";

class ReviewPage extends React.Component {
    constructor() {
    super();

    this.state = {
      rating: 1
    };
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

        <img className="locImage" src={this.props.locData.imagePath}/>
        <button className="backButton" onClick={this.props.backToLocPage}>Back</button>
        <div className="infoContainer">
          <div className="titleContainer">

            <h1>{this.props.locData.name}</h1>
            <h3>{this.props.locData.venueType}</h3>
          </div>
          <div className="ratingsContainer">

        <StarRatingComponent
          name="rate1"
          starCount={5}
          value={rating}
          onStarClick={this.onStarClick.bind(this)}
        />

          </div>
          <p>Please select safety features present</p>
          {this.generateButtonTagIndicators(this.props.locData.tags.filter((tag) => {return tag.val !== 0}))}
        </div>
        <p >Comments:</p>
      <form className="comment" onSubmit={this.handleSubmit}>
        <label>
          <textarea className="commentText" type="text" value={this.state.value} onChange={this.handleChange} />        </label>
          <br></br>
        <input type="submit" value="Submit" />
      </form>
      </div>
    );
  }
  onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }

}

export default ReviewPage;
