var path = require('path')
var webpack = require('webpack')
var PACKAGE = require('./package.json');
var buildVersion = PACKAGE.version;
var buildName = PACKAGE.name;
var CleanWebpackPlugin = require('clean-webpack-plugin');
var preUrl = PACKAGE.preproduction.url + buildName + "/master/webcomponents/";
var prodUrl = PACKAGE.production.url + buildName + "/" + buildVersion + "/dist/";

var pathsToClean = [
  'dist/*.*'
]

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: buildName+'.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
        	  i18n: '@kazupon/vue-i18n-loader'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
     
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
if (process.env.NODE_ENV === 'development') {
	module.exports.output.filename='build.js'
}
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  module.exports.output.publicPath = prodUrl;
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CleanWebpackPlugin(pathsToClean),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

if (process.env.NODE_ENV === 'preproduction') {
    module.exports.devtool = '#source-map';
    module.exports.output.path =  path.resolve(__dirname, './webcomponents'),
    module.exports.output.publicPath = preUrl;
    module.exports.output.filename =   buildName+'_'+buildVersion+'.js'
    
    //module.exports.output.publicPath= PACKAGE.url+ buildName +'/master/dist/';

    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new CleanWebpackPlugin(["webcomponents/*.*"]),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    ])
  }