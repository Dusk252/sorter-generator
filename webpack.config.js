var path = require('path')
var webpack = require('webpack')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');

var clientConfig = {
  name: 'client',
  mode: 'development',
  target: 'web',
  devtool: 'cheap-module-source-map', //source map lets us see original code in the browser when debugging
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/dev-server',
    './src/client/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: 'bundle.js',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
    publicPath: '/'
  },
  module: {
    rules: [ //telling webpack what files we want it to handle
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /src\/server/],
        //running babel on all js/jsx files excluding the node_modules folder
        //rules are configured from the bottom-up, so eslint is run first, then babel
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /(\.css)$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify('development'),
      "process.env.API_URL": JSON.stringify("http://localhost:3000"),
      __isBrowser__: "true"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}

var serverConfig = {
  name: 'server',
  mode: 'development',
  target: 'node',
  devtool: 'cheap-module-source-map', //source map lets us see original code in the browser when debugging
  entry: './src/shared/render.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        // Include js, and jsx files.
        test: /\.(js)x?$/,
        exclude: [/node_modules/, /src\/server/],
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __isBrowser__: "false"
    })
  ]
}

module.exports = [clientConfig, serverConfig]