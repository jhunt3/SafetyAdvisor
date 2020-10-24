/* New cleaned up version of App.js */
import React from 'react';

import './App.css';
import SideMap from './react_components/SideMap';


export class App extends React.Component {

  // a 'global' state that you can pass through to any child componenets of App.
  //   In the Routes below they are passed to both the Home and Queue states.
  
  render() {
    return (
      <div>
        <div className="map">
          <SideMap />
        </div>
      </div>
      
    );
  }

}

export default App;

