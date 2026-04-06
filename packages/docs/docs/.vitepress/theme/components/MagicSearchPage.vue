<template>
  <section class="magic-search-page">
    <section v-if="results.length" class="magic-search-page__results">
      <p class="magic-search-page__summary">
        {{ messages.resultCount(results.length, trimmedKeyword) }}
      </p>
      <a
        v-for="result in results"
        :key="result.link"
        :href="resolveLink(result.link)"
        class="magic-search-page__result"
      >
        <h2>{{ result.title }}</h2>
        <p class="magic-search-page__path">{{ result.link }}</p>
        <p class="magic-search-page__excerpt">{{ result.excerpt }}</p>
      </a>
    </section>

    <section v-else class="magic-search-page__state">
      <p>
        {{
          trimmedKeyword
            ? messages.noResults(trimmedKeyword)
            : messages.emptyState
        }}
      </p>
    </section>
  </section>
</template>

<script>
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import { useData } from "vitepress";
import { searchMagicDocs } from "./magicSearchIndex";

const localeMessages = {
  zh: {
    emptyState: "输入关键字即可搜索当前文档站的页面内容。",
    noResults: (keyword) => `没有找到与“${keyword}”相关的结果。`,
    resultCount: (count, keyword) => `找到 ${count} 条与“${keyword}”相关的结果`,
  },
  en: {
    emptyState: "Type a keyword to search the current documentation set.",
    noResults: (keyword) => `No results found for “${keyword}”.`,
    resultCount: (count, keyword) =>
      `${count} result(s) found for “${keyword}”`,
  },
};

export default defineComponent({
  name: "MagicSearchPage",
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
    const trimmedKeyword = computed(() => keyword.value.trim());
    const results = computed(() => {
      return searchMagicDocs(trimmedKeyword.value, localeKey.value);
    });

    function resolveLink(path) {
      if (basePath.value === "/") {
        return path;
      }

      return `${basePath.value.replace(/\/$/, "")}${path}`;
    }

    function syncKeywordFromLocation() {
      if (typeof window === "undefined") {
        return;
      }

      const currentQuery = new URLSearchParams(window.location.search).get("q");
      keyword.value = currentQuery || "";
    }

    onMounted(() => {
      syncKeywordFromLocation();
      window.addEventListener("popstate", syncKeywordFromLocation);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("popstate", syncKeywordFromLocation);
    });

    return {
      keyword,
      messages,
      resolveLink,
      results,
      trimmedKeyword,
    };
  },
});
</script>
