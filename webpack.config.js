const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
var webpack = require('webpack');
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/client/index.html", 
  filename: "./index.html"
});
///const contextReplacementPlugin = new webpack.ContextReplacementPlugin( /(.+)?angular(\\|\/)core(.+)?/, root('./src'), {} );
module.exports = [
{
  entry: ["./src/client/index"],
  output: {
    path: path.join(__dirname, 'dist/public'),
    filename: "bundle.js"
  },
  plugins: [htmlPlugin],
    resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
	modules: [
		path.join(__dirname, 'src'),
		"node_modules"
	]
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  }
},
{
  entry: ["./src/server/index"],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "server.js"
  },
  resolve: {
  extensions: ['.ts', '.tsx', '.js', '.json'],
  modules: [
	path.join(__dirname, 'src'),
  	"node_modules"
  ]
  },
  target: 'node',
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  }
}
];