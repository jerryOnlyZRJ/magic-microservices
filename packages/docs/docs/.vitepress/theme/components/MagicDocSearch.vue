<template>
  <form class="magic-doc-search" @submit.prevent="submitSearch">
    <span class="magic-doc-search__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path
          d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 1.8a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm6.76 10.2 3.24 3.24-1.27 1.27-3.24-3.24 1.27-1.27Z"
        />
      </svg>
    </span>
    <input
      v-model="keyword"
      :placeholder="messages.placeholder"
      :aria-label="messages.placeholder"
      name="q"
      type="search"
      class="magic-doc-search__input"
    />
  </form>
</template>

<script>
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useData } from "vitepress";

const localeMessages = {
  zh: {
    placeholder: "搜索文档",
    searchPath: "/search/",
  },
  en: {
    placeholder: "Search docs",
    searchPath: "/en/search/",
  },
};

export default defineComponent({
  name: "MagicDocSearch",
  setup() {
    const keyword = ref("");
    const { site } = useData();
    const localeKey = computed(() => {
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/en/")
      ) {
        return "en";
      }

      return "zh";
    });
    const messages = computed(() => {
      return localeMessages[localeKey.value] || localeMessages.zh;
    });
    const basePath = computed(() => site.value.base || "/");

    function syncKeywordFromLocation() {
      if (typeof window === "undefined") {
        return;
      }

      const currentQuery = new URLSearchParams(window.location.search).get("q");
      keyword.value = currentQuery || "";
    }

    function withBase(path) {
      if (basePath.value === "/") {
        return path;
      }

      return `${basePath.value.replace(/\/$/, "")}${path}`;
    }

    function submitSearch() {
      if (typeof window === "undefined") {
        return;
      }

      const targetUrl = new URL(
        withBase(messages.value.searchPath),
        window.location.origin,
      );
      const normalizedKeyword = keyword.value.trim();

      if (normalizedKeyword) {
        targetUrl.searchParams.set("q", normalizedKeyword);
      }

      window.location.assign(targetUrl.toString());
    }

    watch(localeKey, syncKeywordFromLocation, { immediate: true });

    onMounted(() => {
      window.addEventListener("popstate", syncKeywordFromLocation);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("popstate", syncKeywordFromLocation);
    });

    return {
      keyword,
      messages,
      submitSearch,
    };
  },
});
</script>
