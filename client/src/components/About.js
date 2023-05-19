import React, { Component } from 'react'
import './About.css'
class About extends Component {
  


  render() {
    return (


      <div style={{textAlign:"center"}} className="container">

        <div className="about-section">
          <h1>About Us</h1>
          <p>This project was made as Minor Project by Third year student of Vit,Bhopal</p>
          <p>This website basically fetches news from about 250 news sources and provides user short summary using <strong>Extractive text based summarization</strong></p>
        </div>

        
          <div className="row" style={{display:"flex",justifyContent:"center"}}>


            
            
           

            <div className="column" >
              <div className="card">
                <img src="https://avatars.githubusercontent.com/u/75219721?v=4" alt="Shubham" style={{width:"100%",height:"300px"}}/>
                <div className="container">
                  <h3>Shubham Mishra</h3>
                  <p className="title">Developer</p>
                  
                  <p>mshubham0403@gmail.com</p>
                  <p><button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href='https://github.com/mshubham0403';
                    }}
                  className="button">Contact</button></p>
                </div>
              </div>
            </div>

            

            
          </div>


      </div>


    )
  }
}

export default About