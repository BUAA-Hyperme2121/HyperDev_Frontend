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
module.exports = {
  lintOnSave: false,
};
