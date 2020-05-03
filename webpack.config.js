var path = require('path')
var webpack = require('webpack')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');

var clientConfig = {
  entry: './src/client/index.js',
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
        exclude: /node_modules/,
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
  mode: 'development',
  target: 'web',
  devtool: 'cheap-module-source-map', //source map lets us see original code in the browser when debugging
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify('development'),
      "process.env.API_URL": JSON.stringify("http://localhost:3000"),
      __isBrowser__: "true"
    }),
  ]
}

var serverConfig = {
  entry: './src/server/index.js',
  target: 'node',
  devtool: 'cheap-module-source-map', //source map lets us see original code in the browser when debugging
  output: {
    path: __dirname,
    filename: 'server.js',
    publicPath: '/'
  },
  mode: 'development',
  module: {
    rules: [
      {
        // Include js, and jsx files.
        test: /\.(js)x?$/,
        exclude: /node_modules/,
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