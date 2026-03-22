const path = require('path')
const webpack = require('webpack')
const project = require('./config/project.config')
const proxyConfig = require('./config/proxy.config')
const externalConfig = require('./config/externals.config')
const argv = require('yargs-parser')(process.argv.slice(2))
const isAnalyze = !!argv.analyze
const _mode = process.env.NODE_ENV || 'development'
const __DEV__ = _mode === 'development'
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackCdnPlugin = require('webpack-cdn-plugin')
const APP_ENTRY = project.paths.client('index.js')

const defaultWebpackConfig = {
  entry: {
    app: [APP_ENTRY],
  },
  output: {
    filename: 'js/[name].[' + project.compiler_hash_type + '].js',
    path: project.paths.dist(),
    publicPath: project.compiler_public_path,
  },
  devServer: {
    open: true,
    port: project.server_port,
    proxy: proxyConfig,
  },
  plugins: [
    new webpack.DefinePlugin(project.globals),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(en-gb|zh-cn).js/),
    new HtmlWebpackPlugin({
      title: project.name,
      env: project.html_env,
      template: project.paths.client('index.html'),
      favicon: './src/public/favicon.ico',
      hash: false,
      employeeConf: project.html_employee,
      filename: __DEV__ ? 'index.html' : project.paths.template('index.html'),
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
      },
    }),
    new CopyWebpackPlugin([{ from: project.paths.public(), to: project.paths.dist() }]),
  ],
  // externals: {
  //   '@byted-cg/magic-microservice': 'magic',
  // },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      api: path.resolve(__dirname, 'src/api'),
      fetch: path.resolve(__dirname, 'src/utils/fetch'),
    },
  },
}

if (!isAnalyze) {
  defaultWebpackConfig.plugins.push(
    new WebpackCdnPlugin({
      modules: externalConfig,
      prodUrl: 'https://s3a.pstatp.com/cdn/expire-3-M/:name/:version/:path',
    }),
  )
}

module.exports = defaultWebpackConfig
