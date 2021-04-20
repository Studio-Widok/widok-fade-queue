const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = 'production';
// const mode = 'development';

module.exports = {
  mode,
  devtool: mode === 'development' ? 'source-map' : false,
  entry: ['./example/src/js/main.js', './example/src/scss/base.scss'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'example/dist'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './example',
            },
          },
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      browsers: 'defaults',
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(otf|ttf|woff|woff2|jpg|png|gif|svg)$/,
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
};
