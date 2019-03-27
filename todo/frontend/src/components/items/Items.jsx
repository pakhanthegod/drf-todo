/* eslint-env browser */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Items extends Component {
  renderList = () => {
    const { items } = this.props;
    return items.map(item => <li key={item.id}>{item.text}</li>);
  };

  render() {
    return (
      <div>
        <ul>{this.renderList()}</ul>
      </div>
    );
  }
}

Items.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Items;
