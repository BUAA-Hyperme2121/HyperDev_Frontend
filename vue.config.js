const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // dev: {
  //   proxy: {
  //     '/api': { // 请求的代称，写在Axios里的BaseUrl
  //       target: 'http://8.130.12.73:8001', // 真实请求URl
  //       // ws: true,
  //       changeOrigin: true, // 允许跨域
  //       pathRewrite:{
  //         '^/api':''
  //       }
  //     }
  //   }
  // },
});
const path = require("path");
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("svg")
      .test(/\.svg$/) // 匹配 SVG 文件
      .include.add(path.resolve(__dirname, "src")) // 确保仅在特定目录中应用该规则，例如 'src'
      .end()
      .use("html-loader") // 使用 html-loader
      .loader("html-loader")
      .end();
  },
};
module.exports = {
  lintOnSave: false,
};
