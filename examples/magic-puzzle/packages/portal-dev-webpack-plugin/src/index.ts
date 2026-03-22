import webpack, { Compiler } from 'webpack';

class PuzzleDevWebpackPlugin {
  apply(compiler: Compiler): void {
    // 为了兼容webpack的v4和v5
    // https://github.com/jantimon/html-webpack-plugin/issues/1451
    const webpackSource = compiler.webpack || webpack;
    // for dev
    const publicPath = compiler.options.output.publicPath || '';
    compiler.hooks.environment.tap(this.constructor.name, () => {
      if (!compiler.options.devServer) {
        compiler.options.devServer = {};
      }
      const devServer = compiler.options.devServer;

      const port = process.env.PORT || devServer.port;
      const protocol = process.env.HTTPS || devServer.https ? 'https:' : 'http:';
      const host = devServer.host;
      // 修正 publicPath 相关路径
      if (
        compiler.options.mode === 'development' &&
        port &&
        publicPath !== 'auto' &&
        typeof publicPath !== 'function'
      ) {
        compiler.options.output.publicPath = new URL(
          publicPath,
          `${protocol}//${host}:${port}/`,
        ).toString();
        // 禁用 devtool，启用 SourceMapDevToolPlugin
        compiler.options.devtool = false;
        new webpackSource.SourceMapDevToolPlugin({
          append: `\n//# sourceMappingURL=${protocol}//${host}:${port}/[url]`,
          filename: '[file].map',
        }).apply(compiler);
      }

      if (!devServer.headers) {
        devServer.headers = {};
      }
      Object.assign(devServer.headers, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      });
    });
  }
}

export { PuzzleDevWebpackPlugin };
