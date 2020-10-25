import React from 'react';
import StarRatings from 'react-star-ratings';

import "./styles.css";

class LocationPage extends React.Component {
  render() {
    return (
      <div className="body">
        <img className="locImage" src={this.props.locData.imagePath}/>
        <div className="infoContainer">
          <div className="titleContainer">
            <h1>{this.props.locData.name}</h1>
            <h3>{this.props.locData.venueType}</h3>
          </div>
          <div className="ratingsContainer">
            <StarRatings rating={this.props.locData.avgRating}
                        starDimension='30px'
                        starSpacing='10px'/>
            <h3>({this.props.locData.numRatings} Ratings)</h3>
          </div>
        </div>
        <div className="reviewsContainer">
          <h2>Ratings</h2>
        </div>
      </div>
    );
  }

}

export default LocationPage;

