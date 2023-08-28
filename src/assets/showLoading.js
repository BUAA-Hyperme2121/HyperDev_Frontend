// showLoading.js

import ShowLoadingComponent from "@/components/ShowLoadingComponent.vue";

const ShowLoading = {
  install(Vue) {
    // 创建一个loading组件实例
    const LoadingComponent = Vue.extend(ShowLoadingComponent);
    const loadingInstance = new LoadingComponent();

    // 挂载loading组件到新创建的div元素上
    const mountNode = document.createElement("div");
    document.body.appendChild(mountNode);
    loadingInstance.$mount(mountNode);

    // 添加$showLoading属性到Vue原型上
    Vue.prototype.$showLoading = {
      show() {
        loadingInstance.show();
      },
      hide() {
        loadingInstance.hide();
      },
    };
  },
};

export default ShowLoading;
