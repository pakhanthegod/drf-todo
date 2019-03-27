const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'todo/frontend/src/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'todo/frontend/static/frontend/'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
