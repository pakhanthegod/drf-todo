/* eslint-env browser */

import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password1: '',
      password2: '',
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.register();
    this.setState({
      username: '',
      email: '',
      password1: '',
      password2: '',
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  register() {
    const {
      username, email, password1, password2,
    } = this.state;
    const registerUrl = 'http://localhost:8000/api/users/';
    if (password1 === password2) {
      axios
        .post(registerUrl, { username, email, password: password1 })
        .then((response) => {
          console.log(response.status);
        })
        .catch((errors) => {
          console.log(errors);
        });
    }
  }

  render() {
    const {
      username, email, password1, password2,
    } = this.state;
    const usernameId = 'username';
    const emailId = 'email';
    const password1Id = 'password1';
    const password2Id = 'password2';

    return (
      <div className="col-md-6 m-auto">
        <div className="card card-body mt-5">
          <h2 className="text-center">Register</h2>
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
              <label htmlFor={emailId}>
                Email
                <input
                  type="email"
                  className="form-control"
                  id={emailId}
                  name="email"
                  onChange={this.onChange}
                  value={email}
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor={password1Id}>
                Password
                <input
                  type="password"
                  className="form-control"
                  id={password1Id}
                  name="password1"
                  onChange={this.onChange}
                  value={password1}
                />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor={password2Id}>
                Confirm Password
                <input
                  type="password"
                  className="form-control"
                  id={password2Id}
                  name="password2"
                  onChange={this.onChange}
                  value={password2}
                />
              </label>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
