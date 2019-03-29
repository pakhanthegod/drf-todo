/* eslint-env browser */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import Items from './items/Items';
import Login from './accounts/Login';
import Register from './accounts/Register';
import Header from './common/Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
      items: [],
    };
    this.setSignIn = this.setSignIn.bind(this);
    this.checkToken = this.checkToken.bind(this);
    this.updateItems = this.updateItems.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem('access') !== null) {
      if (this.checkToken(localStorage.getItem('access'))) {
        this.getItems();
      }
    }
  }

  setSignIn(signIn) {
    this.setState({
      signIn,
    });
    if (signIn) {
      this.getItems();
    } else {
      this.setState({
        items: [],
      });
    }
  }

  getItems() {
    if (localStorage.getItem('access') !== null) {
      const token = localStorage.getItem('access');

      axios
        .get('http://localhost:8000/api/items/', {
          headers: {
            Authorization: 'Bearer '.concat(token),
          },
        })
        .then((response) => {
          this.setState({
            items: response.data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  checkToken(token) {
    const rawToken = JSON.parse(window.atob(token.split('.')[1]));
    if (Date.now() / 1000 > rawToken.exp) {
      const refresh = localStorage.getItem('refresh');
      axios
        .post('http://localhost:8000/api/token/refresh/', { refresh })
        .then((response) => {
          localStorage.setItem('access', response.data.access);
          this.setSignIn(true);
          return true;
        })
        .catch((error) => {
          console.log(error);
          this.setSignIn(false);
          return false;
        });
    }
    this.setSignIn(true);
    return true;
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Header setSignIn={this.setSignIn} {...this.state} />
          <Route
            path="/"
            exact
            render={() => <Items updateItems={this.updateItems} {...this.state} />}
          />
          <Route path="/login" render={() => <Login setSignIn={this.setSignIn} />} />
          <Route path="/register" render={() => <Register {...this.state} />} />
        </div>
      </Router>
    );
  }
}

export default App;
