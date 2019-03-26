/* eslint-env browser */

import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.authorization(username, password);
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  authorization(username, password) {
    const { setSignIn } = this.props;
    axios
      .post('http://localhost:8000/api/token/', { username, password })
      .then((response) => {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setSignIn(true);
      })
      .catch((error) => {
        console.log(error);
        setSignIn(false);
      });
  }

  render() {
    const { username, password } = this.state;
    const usernameId = 'username';
    const passwordId = 'password';

    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Login</h2>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor={usernameId}>
                Username
                <input
                  type="text"
                  className="form-control"
                  id={usernameId}
                  name="username"
                  onChange={this.onChange}
                  value={username}
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor={passwordId}>
                Password
                <input
                  type="password"
                  className="form-control"
                  id={passwordId}
                  name="password"
                  onChange={this.onChange}
                  value={password}
                />
              </label>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  setSignIn: PropTypes.func.isRequired,
};

export default Login;
