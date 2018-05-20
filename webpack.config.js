const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const PRODUCTION_ENV = "production";
const DEVELOPMENT_ENV = "development";
const { NODE_ENV = PRODUCTION_ENV } = process.env;
const isProduction = NODE_ENV === PRODUCTION_ENV;
const dirDist = path.resolve(__dirname, "dist");
const dirSrc = path.resolve(__dirname, "src");

const config = {
  mode: isProduction ? PRODUCTION_ENV : DEVELOPMENT_ENV,

  entry: dirSrc,

  output: {
    path: dirDist,
    filename: "fish-tacos.js",
    library: "fishTacos",
    libraryTarget: "umd"
  },

  devtool: isProduction ? "source-map" : "cheap-source-map",

  stats: isProduction ? "normal" : "errors-only",

  plugins: [new CleanWebpackPlugin(dirDist)]
};

module.exports = config;
