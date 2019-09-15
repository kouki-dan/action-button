const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, "./src/index.tsx"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
        'ts-loader'
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],
  externals: {
    firebase: 'firebase'
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    proxy: {
      "/__": "http://localhost:5055"
    }
  }
};
