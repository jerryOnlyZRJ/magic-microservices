const path = require('path')

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        useBuiltIns: 'usage',
        corejs: 2,
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    '@babel/plugin-transform-async-to-generator',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        corejs: 2,
        regenerator: true,
      },
    ],
    [
      'import',
      {
        style: true,
        libraryName: 'antd',
      },
    ],
    [
      'import',
      {
        libraryName: 'byted-antx',
        camel2DashComponentName: false,
      },
      'antx',
    ],
    [
      'import',
      {
        libraryName: '@byte-design/icons',
        libraryDirectory: 'icons',
        camel2DashComponentName: false,
      },
      'icons',
    ],
    [
      'import',
      {
        libraryName: '@byte-design/ui',
        libraryDirectory: 'es/components',
        transformToDefaultImport: false,
        style: true,
      },
      'ui',
    ],
    [
      'import',
      {
        libraryName: '@byte-design/illustration',
        libraryDirectory: 'es/illustration',
        camel2DashComponentName: false,
      },
      'illustration',
    ],
    'lodash',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        proposal: 'minimal',
      },
    ],
    '@babel/plugin-proposal-do-expressions',
    [
      'react-css-modules',
      {
        filetypes: {
          '.less': {
            syntax: 'postcss-less',
          },
        },
        generateScopedName: '[name]__[local]__[hash:base64:5]',
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          '@': path.join(__dirname, 'src'),
        },
      },
    ],
  ],
}
