const path = require('path');

module.exports = {
  mode: 'production',
  entry: './es/index.js',
  output: {
    filename: 'juln-hooks.js',
    library: 'ahooks',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.json', '.js'],
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.jsx?$/,
  //       use: {
  //         loader: 'babel-loader',
  //       },
  //     }
  //   ],
  // },
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  ],
};
