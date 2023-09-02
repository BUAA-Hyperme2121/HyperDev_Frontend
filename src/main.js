import Vue from "vue";
import ElementUI from "element-ui";
import App from "./App";
import store from "./store";
import router from "./router";
import "@/custom-component"; // 注册自定义组件
import axios from "axios";
import VueParticles from "vue-particles";
import "@/assets/iconfont/iconfont.css";
import "@/styles/animate.scss";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/reset.css";
import "@/styles/global.scss";
import ShowLoading from "./assets/showLoading.js";

import Contextmenu from "vue-contextmenujs";
Vue.use(Contextmenu);

ElementUI.Dialog.props.lockScroll.default = false;
Vue.use(VueParticles);

Vue.use(ShowLoading);
Vue.prototype.axios = axios;
Vue.use(ElementUI, { size: "small" });
Vue.config.productionTip = false;

axios.defaults.baseURL = "http://8.130.12.73/api";
// axios.defaults.withCredentials = true;
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
