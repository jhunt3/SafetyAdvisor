import React from 'react';

import "./styles.css";

class TagIndicator extends React.Component {
  render() {
    const adjWidth = this.props.name.length * 9 + 10;

    return (
      <div className="tagContainer" style={{width:`${adjWidth}px`}}>
        <span className="tagName">{this.props.name}</span>
        <div className="filled" style={{width:`${this.props.val}%`}}/>
      </div>
    );
  }
}

export default TagIndicator;

