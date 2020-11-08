import React from 'react';
import StarRatings from 'react-star-ratings';
import TagIndicator from '../TagIndicator';

import "./styles.css";

class SearchPage extends React.Component {
    
  generateTagIndicators(tags) {
    return tags.map((tag) => {return <TagIndicator
                                        name={tag.name}
                                        val={tag.val}
                                        />
    });
  }

  render() {
    return(
        <div className="searchResultsContainer">
            <h2>Results</h2>
            {this.props.locData.map(location => (
                <div className="review">
                    <div className="reviewInfoContainer">

                        <img className="searchLocImage" src={location.imagePath}/>
                   
                        <div className="titleContainer">
                            
                            <a className="resultTitle" onClick={() => {
                            this.props.openLocPage(location.id);
                            }}>{location.name}</a>
                            <h3 className="resultSubtitle">{location.venueType}</h3>
                        </div>
                        <div className="avgRatingsContainer">
                            <StarRatings rating={location.avgRating}
                                        starRatedColor="grey"
                                        starEmptyColor="darkgrey"
                                        starDimension='25px'
                                        starSpacing='3px'/>
                            <h3 className="resultSubtitle">({location.numRatings} Ratings)</h3>
                        </div>
                        {this.generateTagIndicators(location.tags.filter((tag) =>
                            {return tag.val !== 0}))}
                    </div>
                </div>
            ))}
        </div>
    )
  }   
}
export default SearchPage;