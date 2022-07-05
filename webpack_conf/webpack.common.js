import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let htmlPageNames = ['login', 'sign-up', 'full'];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    // template: `./src/${name}.html`, // relative path to the HTML files
    template: path.resolve(__dirname, '..', 'src', `${name}.html`),
    filename: `${name}.html`, // output HTML files
  });
});

const config = {
  entry: {
    main: './src/game.js',
  },
  output: {
    filename: '[name]-[contenthash].bundle.js',
    path: path.resolve(__dirname, '../dist'),
    // Replace previously-compiled files with latest one on each build
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Name this file main so it does not get automatically requested as a static file
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'src', 'index.html'),
    }),
    new MiniCssExtractPlugin(),
  ].concat(multipleHtmlPlugins),
  module: {
    rules: [
      {
        // Regex to decide which files to run Babel on
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          // webpack will automatically reference a .babelrc file
          loader: 'babel-loader',
        },
      },
    ],
  },
};

export default config;
