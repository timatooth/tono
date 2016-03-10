var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './src/index'
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/bundle.js',
    // publicPath: '/assets/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/, //this covers .js and .jsx extensions
        exclude: /(node_modules)/,
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
      }, //end of babel loader
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      }
    ],
  }
};
