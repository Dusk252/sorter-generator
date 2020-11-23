const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

const config = {
    mode: 'development',
    // Tell webpack to root file of our client app
    entry: './src/client/index.js',

    // Tell webpack where to put output file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    devtool: 'cheap-module-source-map' //source map lets us see original code in the browser when debugging
    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env': {
    //             BROWSER: JSON.stringify(true)
    //         }
    //     })
    // ]
};

module.exports = merge(baseConfig, config);
