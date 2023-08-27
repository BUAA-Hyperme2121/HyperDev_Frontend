import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: () => import("../views/IndexView.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/project/:project_id",
    redirect: "/project/:project_id/designlist",
    name: "project",
    props: true,
    component: () => import("../views/ProjectView.vue"),
    children: [
      {
        path: "designlist",
        name: "designlist",
        component: () => import("../views/project/DesignList.vue"),
      },
      {
        path: "doclist",
        name: "doclist",
        component: () => import("../views/project/DocList.vue"),
      },
      {
        path: "doc",
        name: "doc",
        component: () => import("../views/project/Doc2Page.vue"),
      },
      {
        path: "design",
        name: "design",
        component: () => import("../views/project/DesignPage.vue"),
      },
    ],
  },
];

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
