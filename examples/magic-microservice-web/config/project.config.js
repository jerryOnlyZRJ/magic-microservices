/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path')
const debug = require('debug')('app:config:project')
const argv = require('yargs').argv
const employee = require('./employee')
const pkg = require('../package.json')

debug('Creating default configuration.')
// BUILD_PARAMS
const BUILD_VERSION = process.env.BUILD_VERSION
const BUILD_TYPE = process.env.BUILD_TYPE || 'test'
const RUN_ONLINE = BUILD_TYPE === 'online'
// ========================================================
// Default Configuration
// ========================================================
const config = {
  name: pkg.name,
  env: process.env.NODE_ENV || 'development',
  analyze: process.env.ANALYZE_ENV || 'noanalyze',
  deploy_name: pkg.publishConfig.module || pkg.name,
  BUILD_TYPE,
  RUN_ONLINE,
  BUILD_VERSION,
  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '..'),
  dir_client: 'src',
  proxy_table: {},
  node_modules: 'node_modules',
  dir_dist: `output/resource/${pkg.publishConfig.module || pkg.name}`,
  dir_template: `output/template/${pkg.publishConfig.module || pkg.name}`,
  dir_public: 'src/public',
  dir_common: 'common',
  dir_server: 'server',
  dir_test: 'tests',
  postcss_sourcemap: false,
  open_browser: true,

  // ----------------------------------
  // Server Configuration
  // ip.address()
  // ----------------------------------
  server_host: 'localhost',
  server_port: process.env.PORT || 3000,

  // ----------------------------------
  // html plugin Structure
  // ----------------------------------
  html_env: 'development',
  html_employee: JSON.stringify(employee),

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel: {
    compact: true,
    cacheDirectory: true,
  },
  compiler_devtool: '#source-map',
  compiler_timestamp: '',
  compiler_hash_type: 'hash:12',
  compiler_fail_on_warning: false,
  compiler_quiet: false,
  compiler_public_path: '/resource/',
  compiler_common_path: '/common/',
  compiler_mock_route: '/mock',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters: [{ type: 'text-summary' }, { type: 'lcov', dir: 'coverage' }],
}

/************************************************
 -------------------------------------------------

 All Internal Configuration Below
 Edit at Your Own Risk

 -------------------------------------------------
 ************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env),
  },
  filename: 'index.html',
  NODE_ENV: config.env,
  RUN_ONLINE,
  BUILD_TYPE: JSON.stringify(BUILD_TYPE),
  BUILD_VERSION: JSON.stringify(BUILD_VERSION),
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test',
  __ANALYZE__: config.analyze === 'analyze',
  __COVERAGE__: !argv.watch && config.env === 'test',
  __BASENAME__: JSON.stringify(process.env.BASENAME || ''),
}

// ------------------------------------
// Utilities
// ------------------------------------
function base() {
  const args = [config.path_base].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}

config.paths = {
  base: base,
  node_modules: base.bind(null, config.node_modules),
  client: base.bind(null, config.dir_client),
  public: base.bind(null, config.dir_public),
  common: base.bind(null, config.dir_common),
  dist: base.bind(null, config.dir_dist),
  template: base.bind(null, config.dir_template),
}

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments.config')
const overrides = environments[config.env]

if (overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}

config.cssModules = {
  localIdentName: '[name]__[local]__[hash:base64:5]',
  // getLocalIdent: (context, localIdentName, localName, options) => {
  //   return localName;
  // },
}

module.exports = config
