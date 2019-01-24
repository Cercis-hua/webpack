const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const template = require('art-template');
const jquery = require('jquery');

module.exports = {
    entry: './src/U3CompoLib.js',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader','css-loader']
        },{
            // test: /\.js$/,
            // enforce: "pre",
            // use: [{
            //     loader: 'jshint-loader'
            // }],
            // exclude: /node_modules/
        },{
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }],
            exclude: /node_modules/
        }],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'head',
            kill: 'bill',
        }),
        new webpack.ProvidePlugin({
            'template': 'template',
            '$': 'jquery'
        })
    ]
}
