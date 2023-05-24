<!-- 全局配置组件 -->
<template>
  <n-config-provider
    abstract
    inline-theme-disabled
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <NaiveProviderContent />
            <slot></slot>
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import {
  zhCN,
  dateZhCN,
  darkTheme,
  useOsTheme,
  useLoadingBar,
  useDialog,
  useMessage,
  useNotification,
} from "naive-ui";
import { mainStore } from "@/store";

const store = mainStore();

// 确保 `statusBarMeta` 变量在元素初始化后才被赋值，避免了传递错误的参数。
let statusBarMeta = null;
onMounted(() => {
  statusBarMeta = document.querySelector('#status-bar-meta');
});

// 明暗切换
let theme = ref(null);
const changeTheme = () => {
  if (store.siteTheme === "light") {
    theme.value = null;
    if (statusBarMeta) {
      setTimeout(function () {
        statusBarMeta.setAttribute('content', 'rgb(250, 250, 252)');
      }, 200);
    }
  } else if (store.siteTheme === "dark") {
    theme.value = darkTheme;
    if (statusBarMeta) {
      setTimeout(function () {
        statusBarMeta.setAttribute('content', 'rgb(16, 16, 20)');
      }, 200);
    }
  }
};

// 监听明暗变化
watch(
  () => store.siteTheme,
  () => {
    changeTheme();
  }
);

// 监听系统明暗变化
const osThemeRef = useOsTheme();
watch(
  () => osThemeRef.value,
  (value) => {
    value == "dark" ? store.setSiteTheme("dark") : store.setSiteTheme("light");
  }
);

// 配置主题色
const themeOverrides = {
  common: {
    primaryColor: "#ea444d",
    primaryColorHover: "#F57B74",
    primaryColorSuppl: "#F57B74",
    primaryColorPressed: "#F64B41",
  },
};

// 挂载 naive 组件的方法
const setupNaiveTools = () => {
  window.$loadingBar = useLoadingBar(); // 进度条
  window.$notification = useNotification(); // 通知
  window.$message = useMessage(); // 信息
  window.$dialog = useDialog(); // 对话框
};

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools();
  },
  render() {
    return h("div", {
      class: {
        tools: true,
      },
    });
  },
});

onMounted(() => {
  changeTheme();
});
</script>
