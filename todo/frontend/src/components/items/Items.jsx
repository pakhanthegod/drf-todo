/* eslint-env browser */

import React from 'react';
import PropTypes from 'prop-types';

function Items(props) {
  const { items } = props;
  const listItems = items.map(item => <li key={item.id}>{item.text}</li>);
  return (
    <div>
      <ul>{listItems}</ul>
    </div>
  );
}

Items.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Items;
