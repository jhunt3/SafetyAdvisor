import React from 'react';

import "./styles.css";

class ButtonTagIndicator extends React.Component {
  render() {
    return (
      <label className="tagContainer"  title={`${this.props.val}%`}>
        <input class="checkbox"type="checkbox"/>
        <span className="tagName"><span class="checkmark"></span>{this.props.name}</span>
        <div className="filled" style={{width:`${this.props.val}%`}}/>
      </label>
    );
  }
}

export default ButtonTagIndicator;
