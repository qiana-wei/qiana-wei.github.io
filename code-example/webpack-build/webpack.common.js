

let path = require('path')
const webpack = require('webpack')

const vueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')


/**
 * @type { import('webpack').Configuration }
 */

module.exports = {
  mode:"development",
  entry:"./src/main.js",
  output:{
    path:path.join(__dirname,'dist'),
    filename:"app.js"
  },
  devtool:'eval-cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  module:{
    rules:[
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use:{
          loader:'vue-loader',
          options: {
            hotReload: true // 关闭热重载
          }
        }
      },
      {
        test: /\.css$/, //处理css
        use:[MiniCssExtractPlugin.loader,'css-loader']
      },
      {
        test: /\.less$/,
        use:[MiniCssExtractPlugin.loader,'css-loader','less-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use:{
          loader:'url-loader',
          options:{ 
            limit:1024 , // 对图片进行压缩
            esModule: false,
            name:''
          }
        }
      },
      {
        test: /\.js$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins:[
    //vue
    new vueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns:[
        {
          from:'public/favicon.ico',
        }
      ]
    }),
    new webpack.DefinePlugin({
      BASE_URL: '"/"'
    }),
    new HtmlWebpackPlugin({
      template:path.join(__dirname,'public/index.html'),
      title:'VUE Webpack Prodtion',
    })
  ]
}