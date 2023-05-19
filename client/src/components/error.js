// https://cdn.dribbble.com/users/761395/screenshots/6287961/error_401.jpg
import React, { Component } from 'react'
import './common.css'


class Error extends Component {
 
  

  render() {
    return (
        <div style={{width:"100%",height:"90vh"}}>
            <img src="https://cdn.dribbble.com/users/761395/screenshots/6287961/error_401.jpg" alt='error' style={{width:"100%",height:"100%"}}/>
            <p>Error try Again</p>
        </div>
    )
  }
}

export default Error