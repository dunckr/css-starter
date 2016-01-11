const webpack = require('webpack')
const path = require('path')
const assign = require('object-assign')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event
const config = {
  output: 'css-starter.css',
  filename: 'index.js',
  bundle: 'bundle.js'
}
const paths = {
  SRC: path.resolve(__dirname, './src'),
  EXAMPLE: path.resolve(__dirname, './example'),
  BUILD: path.resolve(__dirname, './lib')
}

var webpackBase = {
  output: {
    path: paths.EXAMPLE,
    filename: config.bundle
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.css$|\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
    }]
  },
  plugins: [
    new ExtractTextPlugin(config.output, {
      allChunks: true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

if (TARGET === 'start' || !TARGET) {
  module.exports = assign(webpackBase, {
    entry: [
      'webpack/hot/dev-server',
      `${paths.EXAMPLE}/${config.filename}`
    ],
    postcss: [
      require('precss'),
      require('stylelint')
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
  })
}

if (TARGET === 'build') {
  module.exports = assign(webpackBase, {
    entry: `${paths.EXAMPLE}/${config.filename}`,
    postcss: [
      require('precss'),
      require('autoprefixer'),
      require('cssnano')
    ],
  })
}
