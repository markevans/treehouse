module.exports = {
  context: __dirname + "/src",
  entry: "./treehouse.js",

  output: {
    filename: "treehouse.js",
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
