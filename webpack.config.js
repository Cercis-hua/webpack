const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const template = require('art-template');
const jquery = require('jquery');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
        libraryTarget: 'umd',
        library: ["MyLibrary","[name]"]
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader','css-loader']
        },{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                compilerOptions: {
                    preserveWhitespace: false
                }
            }
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
        }),
        new VueLoaderPlugin()
    ]
}
