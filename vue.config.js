const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/demo/',  // 设置公共路径为 /demo/
  devServer: {
    proxy: {
      '/api': {
        target: 'http://47.122.125.199/tradex',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
