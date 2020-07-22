const webpack = require("webpack");
const path = require("path");

let config = {
    entry: path.resolve( __dirname, 'index.js'),
    output: {
      filename: "bundle.js"
    },
    module: {
        rules: [
            { 
              test: /\.js$/,
              loader: 'babel-loader',              
              options: {
                presets: ['react', 'es2015', 'env']
              }
            }],
            }
  }
  
  module.exports = config;