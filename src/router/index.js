import { createRouter, createWebHashHistory } from "vue-router";
import routes from "@/router/routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  if (to.path === "/clearCache") {
    console.log(`开始清理缓存`);
    const cacheNames = await caches.keys();
    if (cacheNames.length > 0) {
      await Promise.all(
        cacheNames.map(async (cacheName) => {
          await caches.delete(cacheName);
          console.log(`以下缓存已清空：${cacheName}`);
        })
      );
    } else {
      console.log(`未发现本地缓存，无需清理`);
    }
    console.log(`准备跳转到首页`);
    await next({ name: "home" });
  } else {
    next();
  }
});

router.afterEach(() => {
  $loadingBar.finish();
});

export default router;