import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    // PWA
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(woff2|woff|ttf)/,
            handler: "CacheFirst",
            options: {
              cacheName: "file-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
        ],
      },
      manifest: {
        name: "今日热榜",
        short_name: "DailyHot",
        description: "汇聚全网热点，热门尽览无余",
        display: "standalone",
        start_url: "/",
        theme_color: "#fff",
        background_color: "#efefef",
        icons: [
          {
            "src": "ico/36.png",
            "sizes": "36x36",
            "type": "image/png"
          },
          {
              "src": "ico/48.png",
            "sizes": "48x48",
            "type": "image/png"
          },
          {
            "src": "ico/72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "ico/96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "ico/144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "ico/192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "ico/196.png",
            "sizes": "196x196",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "ico/512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        pure_funcs: ["console.log"],
      },
    },
  },
});
