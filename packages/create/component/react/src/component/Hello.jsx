import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

function Hello({ name, count }) {
  return (
    <p>
            Hello {name}! {count}
    </p>
  );
}

Hello.propTypes = {
  name: PropTypes.string,
  count: PropTypes.number,
};

export default Hello;
