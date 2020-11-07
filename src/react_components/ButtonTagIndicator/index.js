import React from 'react';

import "./styles.css";

class ButtonTagIndicator extends React.Component {
  render() {
    const adjWidth = this.props.name.length * 10 + 10;

    return (
      <label className="tagContainer" style={{width:`${adjWidth}px`}} title={`${this.props.val}%`}>
      <input type="checkbox"/>
        <span className="tagName">{this.props.name}</span>
        <div className="filled" style={{width:`${this.props.val}%`}}/>
      </label>
    );
  }
}

export default ButtonTagIndicator;
