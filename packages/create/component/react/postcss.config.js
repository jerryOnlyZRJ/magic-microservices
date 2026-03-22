module.exports = {
  plugins: {
    'postcss-preset-env': {
      stage: 0,
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
