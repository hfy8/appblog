/*
 * @Author: bianjie
 * @Date: 2020-06-19 17:29:48
 * @LastEditors: bianjie
 * @LastEditTime: 2020-06-24 14:24:49
 */
const serverProxy = { // 配置跨域
  '/web': {
    target: 'https://ecloud.10086.cn:31008/api/web/', // 这里后台的地址模拟的;应该填写你们真实的后台接口
    ws: true,
    changOrigin: true, // 允许跨域
    pathRewrite: {
      '^/web': '', // 请求的时候使用这个api就可以
    },
  },
};
const env = process.env.NODE_ENV;

module.exports = {
  // 输出文件目录   文件夹名
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。    资源放的目录
  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径    index的路劲和名字
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  publicPath: env === 'production' ? '/blog-static' : '/',
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#337DFF',
        },
        javascriptEnabled: true,
      },
      sass: {
        prependData: '@import "@/style/var.scss";',
      },
    },
  },
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    // development server port 8000
    port: 8080,
    proxy: serverProxy,
  },
  // disable source map in production
  productionSourceMap: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],
};
