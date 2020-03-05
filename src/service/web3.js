import Web3 from 'web3';

let web3;
  // We are in the browser and metamask is running
  if (window.location.pathname === '/seller') {
    // We are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
    console.log(web3)
  }else {
    // We are on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/v3/f6d020232988476c9df771c2686e71a1' 
      //'https://ropsten.infura.io/pBXAeKwWE9Y2B3y2sRnw' //tesnet rinkbey pengirim
      //'https://mainnet.infura.io/ukTTF6TIcLu8rqO10w98'
    );
    web3 = new Web3(provider);  // Reassign web3 to provider
  }
export default web3;
