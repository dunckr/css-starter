import webpack from 'webpack';
import path from 'path';
import assign from 'object-assign';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const TARGET = process.env.npm_lifecycle_event;
const paths = {
  SRC: path.resolve(__dirname, './src'),
  EXAMPLE: path.resolve(__dirname, './example'),
  BUILD: path.resolve(__dirname, './lib')
};
const config = {
  filename: 'sparkler.css'
};

var webpackBase = {
  output: {
    path: paths.EXAMPLE,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader?stage=0']
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]!postcss')
    }]
  },
  postcss: [
    require('autoprefixer')
  ],
  plugins: [
    new ExtractTextPlugin(config.filename, {
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

if (TARGET === 'start' || !TARGET) {
  module.exports = assign(webpackBase, {
    entry: [
      'webpack/hot/dev-server',
      paths.EXAMPLE + '/index.js'
    ],
    debug: true,
    devtool: 'source-map',
    devServer: {
      contentBase: paths.EXAMPLE,
      hot: true,
      inline: true,
      progress: true,
      port: '8080'
    }
  });
}

if (TARGET === 'build') {
  module.exports = assign(webpackBase, {
    entry: paths.EXAMPLE + '/index.js'
  });
}