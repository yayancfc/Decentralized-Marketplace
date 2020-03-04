import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {Nav, Navbar} from 'react-bootstrap';

class NavbarTop extends Component{

    render(){
      return (              
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Market</Navbar.Brand>
            <Nav className="mr-auto">
            <Nav.Link href="/seller">Seller</Nav.Link>
            <Nav.Link href="/buyer">Buyer</Nav.Link>
            <Nav.Link href="/courier">Courier</Nav.Link>
            </Nav>
        </Navbar>
      );
      }
  
}

export default NavbarTop;
