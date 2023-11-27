const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new ZipPlugin({
      filename: "build.zip",
    }),
  ],
});
