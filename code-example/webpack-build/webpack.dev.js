const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')
const {HotModuleReplacementPlugin} = require('webpack')
/**
 * @type { import('webpack').Configuration }
 */
module.exports = merge(common,{
  mode:'development',
  target: 'web',
  devServer:{
    proxy:{
      '/api':{
        target:'http://test.example.com',
        pathRewrite:{
          '^/api':''
        },
        changeOrigin:true
      }
    },
    hot:true,
  },
  plugins:[
    // new HotModuleReplacementPlugin()
  ]

  //添加开发环境特有的配置
})