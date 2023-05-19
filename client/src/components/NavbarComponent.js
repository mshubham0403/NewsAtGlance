import React from 'react';
import { Nav,Navbar } from 'react-bootstrap';
import newslogo from "../images/newslogo.png";

class NavbarComponent extends React.Component {
  
  render() {
  

    return (
      <>
        

<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="/home">
    <img
      src={newslogo}
      width="30"
      height="30"
      className="d-inline-block align-top"
      alt="React Bootstrap logo"
    />
  </Navbar.Brand>
  <Navbar.Brand href="/home">NewsAtGlance</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/register">Register</Nav.Link>
      <Nav.Link href="/login">Login</Nav.Link>
    
    </Nav>
    <Nav>
      
      <Nav.Link href="/About">About Us</Nav.Link>
      <Nav.Link className="border btn-outline-info" href="/Logout">Logout</Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>


      </>



    
    ) 
  }
}

export default NavbarComponent
