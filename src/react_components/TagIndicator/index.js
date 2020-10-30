import React from 'react';

import "./styles.css";

class TagIndicator extends React.Component {
  render() {
    return (
      <div className="tagContainer" title={`${this.props.val}%`}>
        <span className="tagName">{this.props.name}</span>
        <div className="filled" style={{width:`${this.props.val}%`}}/>
      </div>
    );
  }
}

export default TagIndicator;

