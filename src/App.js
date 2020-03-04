import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';
import Home from './view/Home';
import Buyer from './view/Buyer';
import Seller from './view/Seller';
import Courier from './view/Courier';

function App() {
  return (    
      <Router>
        <Switch>
          <Route path="/" exact><Home /></Route>
          <Route path="/buyer"><Buyer /></Route>
          <Route path="/seller"><Seller /></Route>
          <Route path="/courier"><Courier /></Route>
        </Switch>
      </Router>
  );
}

export default App;
