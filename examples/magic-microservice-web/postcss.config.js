const packageJson = require('./package.json');

module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 0,
      browsers: packageJson.browserslist,
    },
    cssnano: {
      discardComments: {
        removeAll: true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
    },
  },
};
