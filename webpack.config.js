module.exports = {
  context: __dirname + "/src",
  entry: "./treehouse.browser.js",

  output: {
    filename: "treehouse.min.js",
    path: __dirname + "/dist",
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ]
  }
}
