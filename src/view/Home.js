import React, {Component} from 'react';
import Navbar from './NavbarTop';
import {Card, CardDeck, CardGroup, CardColumns} from 'react-bootstrap';
import EcommerceStore from '../service/EcommerceStore';
import web3 from '../service/web3';

class Home extends Component{
    constructor(props){
        super(props)
        this.state = {
            produk: [],
            loaded: false
        }

        this.handleBuy = this.handleBuy.bind(this);
    }

    componentDidMount(){
        return EcommerceStore.methods.ProductIndex().call().then((response) => {
            return this.getAllProduct(response, produk => {
                this.setState({ produk })
            });
            
        })
        
    }

    getAllProduct = (totalProduk, cb) => {
        const {produk} = this.state
        for(var i=0; i<=totalProduk; i++){
            EcommerceStore.methods.getProduct(i).call().then((result) => {
                
                this.setState(prev => ({
                    produk: [...prev.produk, result]
                }))
                // produk.push({ ...result })               
            })
        }
        cb(produk)
        // this.setState({ produk: data })     
        // setTimeout(() => {
        //     this.setState({ loaded: true })
        //   }, 500)   

    }

    handleBuy = async (e, id, harga) => {
        e.preventDefault()
        const accounts = await web3.eth.getAccounts();
        var a = web3.utils.toWei(harga, 'ether')
        console.log('accounts', a);
        EcommerceStore.methods.buy(~~id).send(
            {
                value: a,
                from: accounts[0],
                gasPrice: web3.utils.toWei("100000000", 'wei')
            }, (err, transactionHash) => {
                console.log(transactionHash);                    
            })
        
    }

    render(){
      return (  
          <>
        <Navbar/>

        <div className="d-flex" id="wrapper" style={{margin:'1rem'}}>
        
        <CardColumns style={{ margin:'2rem'}}>

        {this.state.produk.sort((item, next) => item[0] > next[0] ? -1 : 1 ).map((item) => {
            return item[9]== 0 && item[1]!='' &&
        
                    <Card style={{width:'300px',}} key={item[0]}>
                        <Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${item[7]}`} style={{height:'180px'}}/>
                        <Card.Body>
                        <Card.Title>{item[1]}</Card.Title>
                        <Card.Text>Deskripsi : {item[6]}</Card.Text>
                        <Card.Text>Harga : {item[3]} Eth</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <a href="#" onClick={(e) => this.handleBuy(e,item[0], item[3])}><i className="fa fa-shopping-cart fa-2x pull-right" aria-hidden="true"></i></a>
                        </Card.Footer>
                    </Card>            
                                     
        })}

        </CardColumns>

        </div>

        </>
      );
  }
 
}

export default Home