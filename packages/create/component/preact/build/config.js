const path = require('path');
const { version, author, name, moduleName, dependencies } = require('../package.json');
const browserExternals = require('./browserExternals');
const { babel } = require('@rollup/plugin-babel');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const alias = require('@rollup/plugin-alias');
const postcss = require('rollup-plugin-postcss');
const { terser } = require('rollup-plugin-terser');
const externalGlobals = require('rollup-plugin-external-globals');
const inject = require('@rollup/plugin-inject');

const banner = `/*!
* ${name} v${version}
* (c) ${new Date().getFullYear()} ${author.email}
*/`;
const DEV = 'development';
const PROD = 'production';

const resolveFile = function (filePath) {
  return path.join(__dirname, '..', filePath);
};

const dependenciesExternals = Object.keys(dependencies).map((item) => {
  if (item === '@babel/runtime') {
    return /@babel\/runtime/;
  }
  return item;
});

const builds = {
  'web-cjs-dev': {
    output: {
      file: resolveFile('dist/index.cjs.js'),
      format: 'cjs',
    },
    external: dependenciesExternals,
    env: DEV,
  },
  'web-esm-dev': {
    output: {
      file: resolveFile('dist/index.esm.js'),
      format: 'esm',
    },
    external: dependenciesExternals,
    env: DEV,
  },
  'web-esm-prod': {
    output: {
      file: resolveFile('dist/index.esm.min.js'),
      format: 'esm',
    },
    external: dependenciesExternals,
    plugins: [terser()],
    env: PROD,
  },
  'web-esm-browser-dev': {
    output: {
      file: resolveFile('dist/index.esm.browser.js'),
      format: 'esm',
    },
    external: Object.keys(browserExternals),
    plugins: [externalGlobals(browserExternals)],
    env: DEV,
  },
  'web-esm-browser-prod': {
    output: {
      file: resolveFile('dist/index.esm.browser.min.js'),
      format: 'esm',
    },
    external: Object.keys(browserExternals),
    plugins: [externalGlobals(browserExternals), terser()],
    env: PROD,
  },
  'web-umd-dev': {
    output: {
      file: resolveFile('dist/index.umd.js'),
      format: 'umd',
    },
    external: Object.keys(browserExternals),
    env: DEV,
  },
  'web-umd-prod': {
    output: {
      file: resolveFile('dist/index.umd.min.js'),
      format: 'umd',
    },
    external: Object.keys(browserExternals),
    plugins: [terser()],
    env: PROD,
  },
  'web-system-dev': {
    output: {
      file: resolveFile('dist/index.system.js'),
      name: null,
      format: 'system',
    },
    external: Object.keys(browserExternals),
    plugins: [externalGlobals(browserExternals)],
    env: DEV,
  },
  'web-system-prod': {
    output: {
      file: resolveFile('dist/index.system.min.js'),
      name: null,
      format: 'system',
    },
    external: Object.keys(browserExternals),
    plugins: [externalGlobals(browserExternals), terser()],
    env: PROD,
  },
};

function genConfig(name) {
  const opts = builds[name];
  const config = {
    ...opts,
    cache: true,
    input: resolveFile('src/index.js'),
    output: {
      name: moduleName,
      globals: browserExternals,
      ...opts.output,
      sourcemap: opts.env === DEV,
      banner,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      postcss({
        extract: resolveFile('dist/index.min.css'),
        sourceMap: true,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
      }),
      alias({
        resolve: ['.js'],
        entries: [
          {
            find: '@',
            replacement: path.resolve(__dirname, '../src'),
          },
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
          { find: 'react-dom', replacement: 'preact/compat' },
          { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
        ],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
      }),
      inject({
        h: ['preact', 'h'],
      }),
    ].concat(opts.plugins || []),
  };
  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getBuild = genConfig;
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}
