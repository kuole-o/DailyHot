<template>
  <div class="list">
    <n-space class="type" v-if="store.newsArr[0]">
      <n-tag round size="large" class="tag" v-for="item in store.newsArr.filter((item) => item.show)" :key="item"
        :type="item.name === listType ? 'primary' : 'default'" @click="changeType(item.name)">
        {{ item.label }}
        <template #avatar>
          <img :src="`/logo/${item.name}.png`" alt="logo" class="logo" />
        </template>
      </n-tag>
    </n-space>
    <n-card class="card">
      <template #header>
        <Transition name="fade" mode="out-in">
          <template v-if="!listData">
            <div class="loading" style="height: 60px">
              <n-skeleton text round height="40px" />
            </div>
          </template>
          <template v-else>
            <div class="header">
              <div class="item">
                <div class="logo">
                  <img :src="`/logo/${listType}.png`" alt="logo" />
                </div>
                <div class="name">
                  <n-text class="title">{{ listData.title }}</n-text>
                  <!-- <n-text class="subtitle" :depth="3">
                    {{ listData.subtitle }}
                  </n-text> -->
                </div>
              </div>
              <div class="data">
                <n-text v-if="listData.total" :depth="3" class="total" v-html="listData.total" />
                <n-text :depth="3" class="time" v-html="updateTime" />
              </div>
            </div>
          </template>
        </Transition>
      </template>
      <Transition name="fade" mode="out-in">
        <template v-if="!listData">
          <div class="loading" style="flex-direction: column">
            <n-skeleton text round :repeat="20" height="40px" style="margin-bottom: 20px" />
          </div>
        </template>
        <template v-else>
          <div class="all">
            <n-list hoverable clickable style="width: 100%">
              <n-list-item v-for="(item, index) in listData.data.slice(
                pageNumber * 20 - 20,
                pageNumber * 20
              )" :key="item" @click="jumpLink(item)">
                <template #prefix>
                  <n-text class="num" :class="index + 1 + (pageNumber - 1) * 20 === 1
                    ? 'one'
                    : index + 1 + (pageNumber - 1) * 20 === 2
                      ? 'two'
                      : index + 1 + (pageNumber - 1) * 20 === 3
                        ? 'three'
                        : null
                    " :depth="2">
                    {{ index + 1 + (pageNumber - 1) * 20 }}
                  </n-text>
                </template>
                <div class="text">
                  <n-text class="title" v-html="item.title" />
                  <div class="item" v-if="item.desc || item.text">
                    <n-text v-if="item.desc" class="desc" :depth="3" v-html="item.desc" />
                    <n-text v-if="item.text" :class="{
                      'hot-text': true,
                      'new': item.text === '新',
                      'film': item.text === '影',
                      'tv': item.text === '剧',
                      'zong': item.text === '综',
                      'music': item.text === '音',
                      'boom': item.text === '爆',
                      'hot': item.text === '热',
                      'fei': item.text === '沸',
                      'warm': item.text === '暖',
                    }" :depth="3" v-html="item.text" />
                  </div>
                </div>
                <!-- <div class="message">
                  <div class="hot" v-if="item.text">
                    <n-icon :depth="3" :component="Fire" />
                    <n-text class="hot-num" :depth="3" v-html="item.text" />
                  </div>
                </div> -->
              </n-list-item>
            </n-list>
            <n-pagination class="pagination" :page-slot="5" :item-count="listData.data.length" :page-sizes="[20]"
              v-model:page="pageNumber" />
          </div>
        </template>
      </Transition>
    </n-card>
  </div>
</template>

<script setup>
import { Fire } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import { useRouter } from "vue-router";
import { formatTime } from "@/utils/getTime";
import { getHotLists } from "@/api";

const router = useRouter();
const store = mainStore();

const updateTime = ref(null);
const listType = ref(
  router.currentRoute.value.query.type || store.newsArr[0].name
);
const pageNumber = ref(
  router.currentRoute.value.query.page
    ? Number(router.currentRoute.value.query.page)
    : 1
);
const listData = ref(null);

// 获取热榜数据
const getHotListsData = async (name, isNew = false) => {
  listData.value = null;
  const item = store.newsArr.find((item) => item.name == name)
  getHotLists(item.name, isNew, item.params).then((res) => {
    console.log(res);
    if (res.code === 200) {
      listData.value = res;
    } else {
      $message.error(res.message);
    }
  });
};

// 链接跳转
const jumpLink = (data) => {
  if (!data.url || !data.mobileUrl) return $message.error("链接不存在");
  const url = window.innerWidth > 680 ? data.url : data.mobileUrl;
  if (store.linkOpenType === "open") {
    window.open(url, "_blank");
  } else if (store.linkOpenType === "href") {
    window.location.href = url;
  }
};

// 切换类别
const changeType = (type) => {
  router.push({
    path: "/list",
    query: {
      type,
      page: 1,
    },
  });
};

// 实时改变更新时间
watch(
  () => store.timeData,
  () => {
    if (listData.value) {
      updateTime.value = formatTime(listData.value.updateTime);
    }
  }
);

// 页数变化
watch(
  () => pageNumber.value,
  (val) => {
    router.push({
      path: "/list",
      query: {
        type: listType.value,
        page: val,
      },
    });
    document.querySelector(".n-back-top")?.click();
  }
);

// 类别变化
watch(
  () => router.currentRoute.value,
  (val) => {
    if (val.name === "list") {
      listType.value = val.query.type;
      pageNumber.value = Number(val.query.page);
      getHotListsData(listType.value);
    }
  }
);

onMounted(() => {
  getHotListsData(listType.value);
});
</script>

<style lang="scss" scoped>
.list {
  .type {
    width: 100%;

    .tag {
      cursor: pointer;

      .logo {
        height: 22px;
        width: 22px;
        margin-left: 6px;
      }
    }
  }

  .card {
    margin-top: 20px;
    border-radius: 8px;

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease-in-out;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }

    .loading {
      display: flex;
      align-items: center;
    }

    :deep(.n-card__content) {
      @media (max-width: 740px) {
        padding: 0 12px 12px 12px;
      }
    }

    .header {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: center;
      justify-content: space-between;
      height: 60px;

      .item {
        display: flex;
        align-items: center;

        .logo {
          display: flex;
          align-items: center;

          img {
            height: 50px;
            width: 50px;
          }
        }

        .name {
          display: flex;
          align-items: center;
          flex-direction: column;
          margin-left: 16px;
          line-height: 1;

          .title {
            font-size: 22px;
            font-weight: bold;
          }

          .subtitle {
            font-size: 14px;
          }
        }
      }

      .data {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 14px;

        .total {
          &::before {
            content: "共 ";
          }

          &::after {
            content: " 条 ·";
            margin-right: 6px;
          }
        }
      }

      @media (max-width: 740px) {
        display: flex;
        justify-content: flex-start;

        .item {
          .logo {
            img {
              width: 32px;
              height: 32px;
            }
          }

          .name {
            margin-left: 12px;
            align-items: flex-end;
            flex-direction: row;

            .subtitle {
              margin-bottom: 3px;
              margin-left: 8px;
            }
          }
        }

        .data {
          margin-left: auto;
        }
      }
    }

    .all {
      display: flex;
      flex-direction: column;
      align-items: center;

      .num {
        width: 24px;
        height: 24px;
        min-width: 24px;
        margin-right: 8px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--n-border-color);
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          background-color: var(--n-close-color-hover);
        }

        &.one {
          background-color: #ea444d;
          color: #fff;
        }

        &.two {
          background-color: #ed702d;
          color: #fff;
        }

        &.three {
          background-color: #eead3f;
          color: #fff;
        }
      }

      .text {
        display: flex;
        flex-direction: column;

        .title {
          font-size: 16px;
        }

        .item {
          display: flex;
          align-items: center;
        }

        .desc {
          overflow: hidden;
          font-size: 14px;
          display: -webkit-inline-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
        }

        .hot-text {
          font-size: 12px;
          color: #fff;
          margin-left: 10px;
          padding: 1px;
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 16px;
          border-radius: 4px;
          text-align: center;
        }

        .hot-text.new {
          background-color: #ff3852;
        }

        .hot-text.warm {
          background-color: #ffab5a;
        }

        .hot-text.film {
          background-color: #3e778a;
        }

        .hot-text.tv {
          background-color: #837600;
        }

        .hot-text.zong {
          background-color: #ffc000;
        }

        .hot-text.music {
          background-color: #f9455c;
        }

        .hot-text.boom {
          background-color: #c50000;
        }

        .hot-text.hot {
          background-color: #ff9406;
        }

        .hot-text.fei {
          background-color: #f86400;
        }
      }

      .message {
        display: flex;
        align-items: center;
        margin-top: 12px;

        .hot {
          display: flex;
          align-items: center;
          font-size: 13px;

          .hot-text {
            margin-left: 4px;
            line-height: 0;
          }
        }
      }

      .pagination {
        margin: 20px 0;
      }

      @media (max-width: 740px) {
        :deep(.n-list-item) {
          padding: 12px 8px 12px 16px;

          .n-list-item__prefix {
            margin-right: 12px;
          }
        }
      }

      @media (min-width: 768px) {
        :deep(.n-list-item) {
          padding: 18px 0px 18px 6px;
        }
      }
    }
  }
}
</style>
