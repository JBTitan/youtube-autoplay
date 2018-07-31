const path = require('path');

const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const targetEnv = process.env.TARGET_ENV || 'firefox';
const isProduction = process.env.NODE_ENV === 'production';

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      TARGET_ENV: JSON.stringify(targetEnv)
    },
    global: {}
  }),
  new ExtractTextPlugin('[name]/style.bundle.css'),
  isProduction ? new LodashModuleReplacementPlugin({shorthands: true}) : null,
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vue', 'manifest'],
    filename: '[name].bundle.js',
    minChunks: Infinity
  }),
  isProduction ? new webpack.optimize.ModuleConcatenationPlugin() : null,
  isProduction ? new MinifyPlugin() : null
];
plugins = plugins.filter(Boolean);

module.exports = {
  entry: {
    background: './src/background/main.js',
    options: './src/options/main.js',
    vue: ['vue']
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'src'),
    filename: '[name]/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                scss: ExtractTextPlugin.extract({
                  use: [
                    {
                      loader: 'css-loader'
                    },
                    {
                      loader: 'sass-loader',
                      options: {
                        includePaths: [path.resolve(__dirname, 'node_modules')]
                      }
                    }
                  ]
                })
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.json', '.css', '.scss', '.vue']
  },
  plugins
};
