module.exports = {
  entry: {
    content_script: './dist/content_script.js',
    background: './dist/background.js'
  },
  watch: false,
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [{search: 'Function(\'return this\')()', replace: 'window'}]
        }
      }
    ]
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
}
