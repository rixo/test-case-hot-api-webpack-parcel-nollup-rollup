module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
  },
  devServer: {
    hot: true,
    contentBase: 'public',
  }
}
