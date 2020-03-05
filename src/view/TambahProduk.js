import React, {Component} from 'react';
import {Nav, Button, Form} from 'react-bootstrap';
import EcommerceStore from '../service/EcommerceStore';
import web3 from '../service/web3';
import ipfs from '../service/ipfs';


class TambahProduk extends Component{
    
    constructor(props){
        super(props)

        this.state = {
            nama: '',
            kategori: '',
            kondisi: '',
            deskripsi: '',
            harga: 0,
            gambar: '',
            buffer: ''
        }

    }

    handleNama = (e) => {
        this.setState({
            nama: e.target.value
        })
    }

    handleDeskripsi = (e) => {
        this.setState({
            deskripsi: e.target.value
        })
    }

    handleHarga = (e) => {
        this.setState({
            harga: e.target.value
        })
    }

    handleKategori = (e) => {
        this.setState({
            kategori: e.target.value
        })
    }

    handleKondisi = (e) => {
        this.setState({
            kondisi: e.target.value
        })
    }

    handleUpload = async (e) => {
        e.preventDefault();
        const accounts = await web3.eth.getAccounts();
        console.log('accounts', accounts[0]);
        

        const nama = this.state.nama;
        const deskripsi = this.state.deskripsi;
        const harga = web3.utils.toWei(this.state.harga, 'ether');
        const buffer = this.state.buffer;   
        const kategori = this.state.kategori; 
        const kondisi = this.state.kondisi; 

        await ipfs.add(buffer, (err, ipfsHash) => {

            console.log(ipfsHash);
            
            EcommerceStore.methods.addProduct(nama, kategori, harga, kondisi, deskripsi, ipfsHash[0].hash).send(
                {
                    from: accounts[0],
                    gasPrice: web3.utils.toWei("100000000", 'wei')
                }, (err, transactionHash) => {
                    if(!err){
                        console.log(transactionHash);
                        
                    }else{
                        console.log(err);
                        
                    }
                })

        })
        

    }

    captureFile =(event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)    
      };

    convertToBuffer = async(reader) => {
      //file is converted to a buffer to prepare for uploading to IPFS
        const buffer = await Buffer.from(reader.result);
      //set this buffer -using es6 syntax
        this.setState({buffer: buffer});
        
    };

    render(){
        return(
            
            <div className="d-flex" id="wrapper">   
            

                <div id="page-content-wrapper" style={{marginLeft:'40vw'}}>
                
                    <div className="container-fluid form-upload">
                    <Form onSubmit={this.handleUpload}>
                        <Form.Group>
                            <Form.Label>Nama Produk</Form.Label>
                            <Form.Control type="text" placeholder="Nama Produk" name="nama" onChange={this.handleNama} value={this.state.nama}/>                                                   
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Deskripsi</Form.Label><br></br>
                            <textarea style={{width:'100%'}} placeholder="Deskripsi" name="deskripsi" onChange={this.handleDeskripsi} value={this.state.deskripsi}/>                            
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Kategori</Form.Label>
                            <Form.Control as="select" name="kategori" onChange={this.handleKategori} value={this.state.kategori}>
                                <option value="Elektronik">Elektronik</option>
                                <option value="Komputer">Olahraga</option>
                                <option value="Aksesoris">Aksesoris</option>
                                <option value="Komputer">Buku</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Kondisi</Form.Label>
                            <Form.Control as="select" name="kondisi" onChange={this.handleKondisi} value={this.state.kondisi}>
                                <option value="0">Baru</option>
                                <option value="1">Bekas</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Harga (Dalam Satuan ETH)</Form.Label>
                            <Form.Control type="number" placeholder="0" name="harga" onChange={this.handleHarga} value={this.state.harga}/>
                            
                        </Form.Group>

                        <Form.Group>
                        <Form.Label>Gambar</Form.Label><br></br>
                            <input type="file" onChange={this.captureFile}/>
                            
                        </Form.Group>

                        <Form.Group>
                            <Button type="submit" style={{marginRight:'1rem'}} className="btn btn-primary" >Upload</Button>   
                            <Button className="btn btn-primary" id="btnReset" >Reset</Button>    
                        </Form.Group>
                        
                    </Form>
                    </div>
                </div>
            </div>
            
        );
    };
}

export default TambahProduk;