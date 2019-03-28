/* eslint-env browser */
/* eslint no-unused-vars: ["error", { "args": "none" }] */

import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class Items extends Component {
  static delete(id) {
    const deleteUrl = `http://localhost:8000/api/items/${id}/`;
    const token = localStorage.getItem('access');
    axios
      .delete(deleteUrl, {
        headers: {
          Authorization: 'Bearer '.concat(token),
        },
      })
      .then((response) => {
        console.log('Item deleted');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onClick = (e) => {
    const { items, updateItems } = this.props;
    const { id } = e.target;
    Items.delete(id);
    const newItems = items.filter(obj => obj.id !== parseInt(id, 10));
    updateItems(newItems);
  };

  renderList() {
    const { items } = this.props;
    const list = items.map(item => (
      <li className="list-group-item" key={item.id}>
        {item.text}
        <button
          className="btn btn-primary float-right"
          id={item.id}
          type="button"
          onClick={this.onClick}
        >
          Delete
        </button>
      </li>
    ));
    return list;
  }

  render() {
    return (
      <div>
        <ul className="offset-md-3 col-md-6 list-group">{this.renderList()}</ul>
      </div>
    );
  }
}

Items.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateItems: PropTypes.func.isRequired,
};

export default Items;
