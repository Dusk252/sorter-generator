module.exports = {
    // Tell webpack to run babel on every file it runs through
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react', ['@babel/env', { targets: { browsers: ['last 2 versions'] } }]]
                }
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'isomorphic-style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 esModule: false
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.less$/,
                use: [
                    'isomorphic-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            esModule: false
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[contenthash].[ext]',
                            outputPath: 'static/img',
                            esModule: false // <- here
                        }
                    }
                ]
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false
                }
            }
        ]
    },
    optimization: {
        usedExports: true
    },
    plugins: [
        {
            apply: (compiler) => {
                compiler.hooks.done.tap('DonePlugin', (stats) => {
                    console.log('Compile is done!');
                    setTimeout(() => {
                        process.exit(0);
                    });
                });
            }
        }
    ],
    experiments: {
        topLevelAwait: true
    }
};
