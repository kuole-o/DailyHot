const routes = [
  // 首页
  {
    path: "/",
    name: "home",
    meta: {
      title: "首页",
      class: "home",
    },
    component: () => import("@/views/Home.vue"),
  },
  // 新闻列表
  {
    path: "/list",
    name: "list",
    meta: {
      title: "新闻列表",
      class: "list",
    },
    component: () => import("@/views/List.vue"),
  },
  // 设置页
  {
    path: "/setting",
    name: "setting",
    meta: {
      title: "全局设置",
      class: "setting",
    },
    component: () => import("@/views/Setting.vue"),
  },
  // 测试页面
  {
    path: "/test",
    name: "test",
    meta: {
      title: "test",
      class: "test",
    },
    component: () => import("@/views/Test.vue"),
  },
  // 清空缓存
  {
    path: "/clean",
    name: "clean",
    meta: {
      title: "清空缓存",
      class: "clean",
    },
  },
  // 403
  {
    path: "/403",
    name: "403",
    meta: {
      title: "403",
    },
    component: () => import("@/views/403.vue"),
  },
  // 404
  {
    path: "/404",
    name: "404",
    meta: {
      title: "404",
    },
    component: () => import("@/views/404.vue"),
  },
  // 500
  {
    path: "/500",
    name: "500",
    meta: {
      title: "500",
    },
    component: () => import("@/views/500.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

export default routes;
