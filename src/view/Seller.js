import React, {Component} from 'react';
import Navbar from './NavbarTop';
import {Tabs, Tab} from 'react-bootstrap';
import TambahProduk from './TambahProduk';
import StatusProduk from './StatusProduk';

class Seller extends Component{

    render(){
      return (  
          <>
        <Navbar/>

        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" style={{margin:'2rem'}}>
            <Tab eventKey="home" title="Status Produk">
                <StatusProduk />
            </Tab>
            <Tab eventKey="profile" title="Tambah Produk">
                <TambahProduk />
            </Tab>
        </Tabs>

        </>
      );
  }
 
}

export default Seller