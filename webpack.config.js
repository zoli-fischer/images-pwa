const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '.env') }).parsed;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const env = process.env.NODE_ENV || 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const https = (dotenv && dotenv.HTTPS === 'true') || false;
const httpsCertPath = (dotenv && dotenv.HTTPS_CERT_PATH) || '';
const httpsKeyPath = (dotenv && dotenv.HTTPS_KEY_PATH) || '';
const httpsCaPath = (dotenv && dotenv.HTTPS_CERT_CA) || '';

const getHttps = () => {
    if (https) {
        if (httpsCertPath || httpsKeyPath || httpsCaPath) {
            return {
                cert: fs.readFileSync(httpsCertPath),
                key: fs.readFileSync(httpsKeyPath),
            };
        }
        return true;
    }
    return false;
};

const config = {
    bail: true,
    mode: env,
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[hash].js',
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
    },
    devtool: false,
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                exclude: [/\.html$/, /\.(js|jsx)$/, /\.css$/, /\.json$/, /\.svg$/],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                include: [path.resolve('./src'), path.resolve('./cms')],
                loader: 'babel-loader',
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDevelopment,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        // This helps ensure the builds are consistent if source hasn't changed:
        new webpack.optimize.OccurrenceOrderPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: './index.html',
        }),
        new GenerateSW(),
    ],
    devServer: {
        historyApiFallback: true,
        https: getHttps(),
        http2: true,
        contentBase: path.resolve('./static'),
        publicPath: '/',
    },
};

module.exports = config;
