import React, {Component} from 'react';
import Navbar from './NavbarTop';
import {Table, Button} from 'react-bootstrap';
import EcommerceStore from '../service/EcommerceStore';
import web3 from '../service/web3';

class Courier extends Component{

    constructor(props){
        super(props)
        this.state = {
            produk: [],
            loaded: false,
            accounts: ''
        }
    }

    componentDidMount(){
        setInterval(() =>{
            this.setState({ w: Date.now()})
          }, 2000)
          web3.eth.getAccounts().then(accounts =>{
            this.setState({ 
                accounts : accounts[0]
            })
          })

        console.log('accounts',this.state.accounts);
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
        

    }

    handleProsesPesanan = async (e, id) => {
        e.preventDefault();
        console.log(id);
        
        const accounts = await web3.eth.getAccounts();
        console.log('accounts', accounts[0]);
        
        EcommerceStore.methods.releaseAmountToSeller(id).send(
            {
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
        <div className="d-flex" id="wrapper" style={{margin:'2rem'}}>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                    <th>No</th>
                    <th>Nama Produk</th>
                    <th>Harga</th>
                    <th>Pembeli</th>
                    <th>Status</th>
                    <th>Proses Pesanan</th>
                    </tr>
                </thead>
                <tbody>
                
                {this.state.produk.sort((item, next) => item[0] > next[0] ? 1 : -1 ).map((item, index) => {

                    return item[9]== 2 && 
                    
                    <tr key={item[0]}>
                    <td>{item[0]}</td>
                    <td>{item[1]}</td>
                    <td>{item[3]} Eth</td>
                    <td>{item[5]}</td>
                    <td>Pesanan Sedang Dikirim</td>
                    <td><Button onClick={(e) => {this.handleProsesPesanan(e, item[0])}}>Pesanan Sampai</Button></td>
                    </tr>

                    } 
                    
                )}
                    
                </tbody>
                </Table>
        </div>

        </>
      );
  }
 
}

export default Courier