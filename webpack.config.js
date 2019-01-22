const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        // path: path.resolve(__dirname, 'dist')
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
            filename: '[name]-[hash].html',
            template: 'index.html',
            inject: 'head',
            kill: 'bill',
        })
    ]
}
