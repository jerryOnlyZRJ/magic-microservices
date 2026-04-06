import { Fragment, h } from "vue";
import DefaultTheme from "vitepress/theme";
import MagicDocSearch from "./components/MagicDocSearch.vue";
import MagicPlayground from "./components/MagicPlayground.vue";
import MagicSearchPage from "./components/MagicSearchPage.vue";
import MagicSiteEnhancer from "./components/MagicSiteEnhancer.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout() {
    return h(Fragment, null, [
      h(DefaultTheme.Layout, null, {
        "navbar-search": () => h(MagicDocSearch),
      }),
      h(MagicSiteEnhancer),
    ]);
  },
  enhanceApp({ app }) {
    app.component("MagicDocSearch", MagicDocSearch);
    app.component("MagicPlayground", MagicPlayground);
    app.component("MagicSearchPage", MagicSearchPage);
    app.component("MagicSiteEnhancer", MagicSiteEnhancer);
  },
};
