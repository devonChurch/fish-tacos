const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PRODUCTION_ENV = 'production';
const DEVELOPMENT_ENV = 'development';
const { NODE_ENV = PRODUCTION_ENV } = process.env;
const isProduction = NODE_ENV === PRODUCTION_ENV;
const dirDist = path.resolve(__dirname);
const dirSrc = path.resolve(__dirname, 'src');
const libraryName = 'fishTacos';

const config = {
  mode: isProduction ? PRODUCTION_ENV : DEVELOPMENT_ENV,

  entry: dirSrc,

  output: {
    path: dirDist,
    filename: 'index.js',
    library: libraryName,
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },

  devtool: isProduction ? 'source-map' : 'cheap-source-map',

  stats: isProduction ? 'normal' : 'errors-only',

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: dirSrc,
      },
    ],
  },

  resolve: {
    extensions: ['.ts'],
  },

  // plugins: [new CleanWebpackPlugin(dirDist)]
};

module.exports = config;
