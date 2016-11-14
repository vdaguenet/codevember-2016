const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './',
    filename: 'build.js'
  },
  resolve: {
    alias: {
      objects: path.join(__dirname, 'src/objects'),
      lib: path.join(__dirname, 'src/lib')
    }
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }
};
