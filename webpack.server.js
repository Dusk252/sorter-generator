const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.js');
const Dotenv = require('dotenv-webpack');

const config = {
    // Inform webpack that we're building a bundle
    // for nodeJS, rather than for the browser
    target: 'node',

    // Tell webpack the root file of our
    // server application
    entry: './src/server.js',
    // We don't serve bundle.js for server, so we can use dynamic external imports
    externals: [webpackNodeExternals()],

    // Tell webpack where to put the output file
    // that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                STATIC_PATH: JSON.stringify('./public')
            }
        }),
        new Dotenv()
    ]
};

module.exports = merge(baseConfig, config);
