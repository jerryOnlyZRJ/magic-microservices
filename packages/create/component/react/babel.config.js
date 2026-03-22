const isInBrowserESM = !!~process.env.TARGET.indexOf('esm-browser');

module.exports = {
  presets: [[
    '@babel/preset-env',
    {
      modules: false,
      targets: {
        esmodules: isInBrowserESM,
      },
    },
  ], '@babel/preset-react'],
  plugins: ['@babel/plugin-transform-runtime'],
};
