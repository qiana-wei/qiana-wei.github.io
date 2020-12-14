const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common,{
  mode:'production',
  output:{
    filename:"[name]-[hash:8].js"
  },
  optimization:{
    usedExports:true,
    concatenateModules:true,
    minimize:true,
  },
  plugins:[
    new CleanWebpackPlugin(),
	 	new MiniCssExtractPlugin({
      filename:'[name]-[hash:8].css'
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ]
  //添加生产环境特有的配置
})