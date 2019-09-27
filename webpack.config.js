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
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      gtmContainerId: process.env.GTM_CONTAINER_ID,
      template: 'index.html'
    })
  ],
  externals: {
    firebase: 'firebase'
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    historyApiFallback: true,
    proxy: {
      "/__": "http://localhost:5055", // Firebase Hosting reserved url: https://firebase.google.com/docs/hosting/reserved-urls
      "/button": "http://localhost:5055" // Rewrite function in firebase.json
    }
  }
};
