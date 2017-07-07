const webpack = require('webpack');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');


const sourcePath = path.join(__dirname, './src');
const staticsPath = path.join(__dirname, '../data/');

module.exports = function (env) {
    const nodeEnv = env && env.prod ? 'production' : 'development';
    const isProd = nodeEnv === 'production';

    const plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
            filename: 'vendor.bundle.js'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'highlightjs',
            minChunks: function (module) {
                // only hljs
                return module.context && module.context.indexOf('node_modules/highlight\.js') !== -1;
            },
            filename: 'hljs.bundle.js'
        }),
        new webpack.optimize.CommonsChunkPlugin({name: 'manifest'}),
        new webpack.EnvironmentPlugin({
            NODE_ENV: nodeEnv
        }),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            title: 'Selenoid UI',
            hash: true,
            template: 'index.ejs'
        }),
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // })
    ];

    if (isProd) {
        plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: true
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true
                },
                output: {
                    comments: false
                }
            })
        );
    } else {
        plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
    }

    return {
        plugins,
        devtool: isProd ? 'source-map' : 'eval',
        context: sourcePath,
        entry: {
            js: './index.js',
            vendor: [
                'react'
            ]
        },
        output: {
            path: staticsPath,
            filename: '[name].bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'file-loader',
                        query: {
                            name: '[name].[ext]'
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader'
                    ]
                },
                // explicit noVNC babel-loading
                // more info: https://github.com/joeeames/WebpackFundamentalsCourse/issues/3
                {
                    test: /noVNC\/.*\.(js|jsx)$/,
                    use: [
                        'babel-loader'
                    ],
                    exclude: [
                        'karma.conf.js'
                    ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: 'file-loader?name=/static/fonts/[name].[ext]'
                },
            ]
        },
        resolve: {
            extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
            modules: [
                path.resolve(__dirname, 'node_modules'),
                sourcePath
            ]
        },
        performance: isProd && {
            maxAssetSize: 1000000,
            maxEntrypointSize: 700000,
            hints: 'warning'
        },

        stats: {
            colors: {
                green: '\u001b[32m'
            }
        },

        devServer: {
            contentBase: './src',
            historyApiFallback: true,
            port: 3000,
            compress: isProd,
            inline: !isProd,
            hot: !isProd,
            stats: {
                assets: true,
                children: false,
                chunks: false,
                hash: false,
                modules: false,
                publicPath: false,
                timings: true,
                version: false,
                warnings: true,
                colors: {
                    green: '\u001b[32m'
                }
            },
            proxy: {
                "/events": 'http://localhost:8080/',
                "/ws": {
                    target: 'ws://localhost:8080/',
                    ws: true
                },
                "/vnc/": {
                    target: "http://localhost:3000",
                    pathRewrite: {"^/vnc/": ""},
                    ws: true
                },
                "/log/": {
                    target: "http://localhost:3000",
                    pathRewrite: {"^/log/": ""},
                    ws: true
                }
            }
        }
    };
};
