const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {

  entry: ['babel-polyfill', './src/client/index.tsx'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: './js/[name].bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractCssChunks.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(tsx|ts)$/,
        use: [
          {
            loader: 'awesome-typescript-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }

    ]
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    alias: {
      style: path.resolve(__dirname, 'src', 'style')
      }
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8050',
    }

  },
  plugins: [
    new ExtractCssChunks({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    //new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Static Back Editor'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'client'),
          to: 'assets'
        }
      ],

    })
  ]
};
