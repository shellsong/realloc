'use strict'

var path = require('path')
  , webpack = require('webpack')

module.exports = {
  devtool:'cheap-module-source-map',
  amd:true,
  context:path.join(__dirname, '..', 'src'),
  entry:{
    index:['./index']
  },
  output:{
    path:path.join(__dirname, '..', 'lib'),
    filename: '[name].js'
  },
  module:{
    loaders:[{
      test: /\.(js)$/,
      loader:'babel-loader'
    }]
  }
}
