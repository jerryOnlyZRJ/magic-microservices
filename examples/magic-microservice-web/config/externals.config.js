const process = require('process')

module.exports = [
  {
    name: 'lodash',
    cdn: 'lodash.js',
    var: '_',
    path: 'lodash.min.js',
  },
  {
    name: 'react',
    var: 'React',
    path: `umd/react.${process.env.NODE_ENV === 'development' ? 'development' : 'production.min'}.js`,
  },
  {
    name: 'react-dom',
    var: 'ReactDOM',
    path: `umd/react-dom.${process.env.NODE_ENV === 'development' ? 'development' : 'production.min'}.js`,
  },
  {
    name: 'react-router',
    var: 'ReactRouter',
    path: 'react-router.min.js',
  },
  {
    name: 'react-router-dom',
    var: 'ReactRouterDOM',
    path: 'react-router-dom.min.js',
  },
  {
    name: 'immutable',
    var: 'Immutable',
    path: 'immutable.min.js',
  },
  {
    name: 'prop-types',
    var: 'PropTypes',
    path: 'prop-types.min.js',
  },
  {
    name: 'history',
    var: 'History',
    path: 'history.min.js',
  },
  {
    name: 'classnames',
    var: 'classNames',
    path: 'index.min.js',
  },
  {
    name: 'numeral',
    cdn: 'numeral.js',
    var: 'numeral',
    path: 'numeral.min.js',
  },
]
