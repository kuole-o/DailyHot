import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      // 系统主题
      siteTheme: "light",
      siteThemeAuto: true,
      // 新闻类别
      newsArr: [
        {
          label: "微博",
          value: "weibo",
          order: 0,
          show: true,
        },
        {
          label: "哔哩哔哩",
          value: "bilibili",
          order: 1,
          show: true,
        },
        {
          label: "抖音",
          value: "douyin",
          order: 2,
          show: true,
        },
        {
          label: "知乎",
          value: "zhihu",
          order: 3,
          show: true,
        },
        {
          label: "36氪",
          value: "36kr",
          order: 4,
          show: true,
        },
        {
          label: "百度",
          value: "baidu",
          order: 5,
          show: true,
        },
        {
          label: "少数派",
          value: "sspai",
          order: 6,
          show: true,
        },
        {
          label: "IT之家",
          value: "ithome",
          order: 7,
          show: true,
        },
        {
          label: "澎湃新闻",
          value: "thepaper",
          order: 8,
          show: true,
        },
        {
          label: "今日头条",
          value: "toutiao",
          order: 9,
          show: true,
        },
        {
          label: "百度贴吧",
          value: "tieba",
          order: 10,
          show: true,
        },
        {
          label: "稀土掘金",
          value: "juejin",
          order: 11,
          show: true,
        },
        {
          label: "腾讯新闻",
          value: "newsqq",
          order: 12,
          show: true,
        },
      ],
      // 链接跳转方式
      linkOpenType: "open",
      // 页头固定
      headerFixed: true,
      // 时间数据
      timeData: null,
    };
  },
  getters: {},
  actions: {
    // 更改系统主题
    setSiteTheme(val) {
      $message.info(`您已切换为${val === "dark" ? "深色模式 🌙🌙" : "浅色模式 ⛱️⛱️"}`, {
        showIcon: false,
      });
      this.siteTheme = val;
      this.siteThemeAuto = false;
    },
  },
  persist: [
    {
      storage: localStorage,
      paths: [
        "siteTheme",
        "siteThemeAuto",
        "newsArr",
        "linkOpenType",
        "headerFixed",
      ],
    },
  ],
});
