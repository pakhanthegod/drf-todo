/* eslint-env browser */

import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { text } = this.state;
    const { signIn, updateItems, items } = this.props;

    if (signIn) {
      const token = localStorage.getItem('access');

      axios
        .post(
          'http://localhost:8000/api/items/',
          {
            text,
          },
          {
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
          },
        )
        .then((response) => {
          items.push(response.data);
          updateItems(items);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({
      text: '',
    });
  };

  render() {
    const { text } = this.state;
    const textId = 'textId';
    return (
      <div className="col-md-6 m-auto">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor={textId}>
              Text:
              <textarea
                type="text"
                className="form-control"
                id={textId}
                name="text"
                onChange={this.onChange}
                value={text}
              />
            </label>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Form.propTypes = {
  signIn: PropTypes.bool.isRequired,
  updateItems: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Form;
