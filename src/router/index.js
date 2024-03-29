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
    children: [
      {
        path: "team",
        name: "team",
        // redirect: "/home/team/projects",
        component: () => import("../views/team/TeamView.vue"),
        children: [
          {
            path: "projects",
            name: "projects",
            component: () => import("../views/team/TeamProjectsView.vue"),
          },
          {
            path: "manage",
            name: "manage",
            component: () => import("../views/team/TeamManageView.vue"),
          },
          {
            path: "setting",
            name: "setting",
            component: () => import("../views/team/TeamSettingView.vue"),
          },
          {
            path: "recycle",
            name: "recycle",
            component: () => import("../views/team/TeamRecycleView.vue"),
          },
        ],
      },
      {
        path: "message",
        name: "message",
        component: () => import("../views/message/MessageView.vue"),
        children: [
          {
            path: "detail",
            name: "detail",
            component: () => import("../views/message/MsgDetailView.vue"),
          },
        ],
      },
      {
        path: "chat",
        name: "chat",
        component: () => import("../views/chat/ChatView.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/account/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/account/RegisterView.vue"),
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
        component: () => import("../views/project/Doc2List.vue"),
      },
      {
        path: "doc",
        name: "doc",
        component: () => import("../views/project/DocPage.vue"),
      },
      {
        path: "design",
        name: "design",
        component: () => import("../views/project/DesignPage.vue"),
      },
    ],
  },
  {
    path: "/docread",
    name: "docread",
    component: () => import("../views/project/DocRead.vue"),
  },
  {
    path: "/designlistread/:project_id",
    name: "designlistread",
    component: () => import("../views/project/DesignListRead.vue"),
  },
  {
    path: "/designread",
    name: "designread",
    component: () => import("../views/project/DesignRead.vue"),
  },
];

// 解决路由跳转报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
