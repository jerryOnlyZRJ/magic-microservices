const isBrowserESM = !!~process.env.TARGET.indexOf('esm-browser');

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          esmodules: isBrowserESM,
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties', 'dev-expression'],
};
