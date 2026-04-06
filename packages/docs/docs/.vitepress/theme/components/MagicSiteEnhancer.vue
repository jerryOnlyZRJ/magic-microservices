<script>
import { computed, defineComponent, nextTick, onMounted, watch } from "vue";
import { useData } from "vitepress";

const localeMessages = {
  zh: {
    title: "Magic Microservices - 轻量级微前端文档与 Playground",
    description:
      "Magic Microservices 官方文档，覆盖快速开始、设计理念、生态扩展、API 与在线 Playground，帮助团队以 Web Components 方式落地轻量级微前端。",
    imageAlt: "Magic Microservices 标志",
    locale: "zh_CN",
    language: "zh-CN",
  },
  en: {
    title: "Magic Microservices - Lightweight Micro Frontend Docs & Playground",
    description:
      "Official Magic Microservices docs for lightweight micro frontends with Web Components, including quick start guides, API reference, ecosystem adapters, and live playground demos.",
    imageAlt: "Magic Microservices logo",
    locale: "en_US",
    language: "en-US",
  },
};

const pageSeoOverrides = {
  "guide/getting-started.md": {
    description:
      "快速开始使用 Magic Microservices，了解安装方式、首个微应用注册流程，以及它与应用级编排方案的关系。",
  },
  "guide/core-concepts.md": {
    description:
      "了解 Magic Module、Custom Element、生命周期与框架无关的模块交付模型，建立 Magic 的核心概念认知。",
  },
  "guide/design-philosophy.md": {
    description:
      "深入理解 Magic 的设计理念，包括 Web Components Plus、薄桥接层、模块即实体与框架抹平等核心判断。",
  },
  "guide/core-capabilities.md": {
    description:
      "查看 Magic 的核心能力，包括最小运行时闭环、useProps 引用透传能力与文档内在线示例。",
  },
  "guide/lifecycle.md": {
    description:
      "系统理解 Magic Module 的 bootstrap、mount、updated、unmount 生命周期，以及各阶段的职责边界。",
  },
  "guide/props.md": {
    description:
      "学习 Magic 的 Props 与数据传递机制，掌握 propTypes、原始类型映射与 useProps 引用类型透传方式。",
  },
  "guide/register.md": {
    description:
      "了解如何通过 magic() 注册模块、定义标签协议，并将微应用交付为浏览器可消费的 Custom Element。",
  },
  "api/magic.md": {
    title: "magic() API 参考 - 模块注册与标签交付",
    description:
      "查阅 magic() API 文档，了解模块注册参数、生命周期协议与标签化交付方式。",
  },
  "api/use-props.md": {
    title: "useProps() API 参考 - 引用类型 Props 透传",
    description:
      "查阅 useProps() API 文档，掌握引用类型 Props 传递、读取与运行时消费方式。",
  },
  "guide/ecosystem-expansion.md": {
    title: "生态扩展已迁移",
    description:
      "旧的生态扩展页面已迁移到新的独立入口，请前往最新的生态扩展文档查看 adapters、选型建议与 Playground demo。",
    noindex: true,
    canonicalPath: "/ecosystem/",
  },
  "search/index.md": {
    title: "搜索",
    description:
      "Magic 文档站内搜索页，用于检索当前文档内容，不作为搜索引擎独立收录页面。",
    noindex: true,
    canonicalPath: "/search/",
  },
  "en/guide/getting-started.md": {
    description:
      "Get started with Magic Microservices in minutes, from installation and your first module registration to where it fits beside app-level orchestration.",
  },
  "en/guide/core-concepts.md": {
    description:
      "Learn the core concepts behind Magic, including Magic Module, Custom Element delivery, lifecycle contracts, and framework-agnostic module composition.",
  },
  "en/guide/design-philosophy.md": {
    description:
      "Explore the design philosophy behind Magic, from Web Components Plus and thin bridging to module-first delivery and framework-neutral consumption.",
  },
  "en/guide/core-capabilities.md": {
    description:
      "See what Magic can do out of the box, including the smallest useful runtime loop, useProps reference passing, and live interactive demos.",
  },
  "en/guide/lifecycle.md": {
    description:
      "Understand the full Magic module lifecycle, including bootstrap, mount, updated, and unmount, and what each stage is responsible for.",
  },
  "en/guide/props.md": {
    description:
      "Understand how Magic handles data flow through propTypes, primitive attribute mapping, and useProps-based reference passing.",
  },
  "en/guide/register.md": {
    description:
      "See how magic() registers modules, defines delivery contracts, and turns frontend capabilities into browser-consumable Custom Elements.",
  },
  "en/api/magic.md": {
    title: "magic() API Reference - Module Registration",
    description:
      "Read the magic() API reference for module registration, lifecycle contracts, and HTML-tag-based delivery in Magic Microservices.",
  },
  "en/api/use-props.md": {
    title: "useProps() API Reference - Reference Props Delivery",
    description:
      "Read the useProps() API reference to understand reference-value props delivery, runtime access, and data sharing in Magic modules.",
  },
  "en/guide/ecosystem-expansion.md": {
    title: "Ecosystem moved",
    description:
      "The old ecosystem guide has moved to the new standalone ecosystem page with adapters, selection advice, and playground demos.",
    noindex: true,
    canonicalPath: "/en/ecosystem/",
  },
  "en/search/index.md": {
    title: "Search",
    description:
      "Site search page for the Magic documentation set. This page is intended for in-site discovery rather than search engine indexing.",
    noindex: true,
    canonicalPath: "/en/search/",
  },
};

export default defineComponent({
  name: "MagicSiteEnhancer",
  setup() {
    const { frontmatter, page, site, theme } = useData();
    const relativePath = computed(() => page.value.relativePath || "");
    const localeKey = computed(() => {
      return site.value.lang === "en-US" ? "en" : "zh";
    });

    function getPageSeoOverride() {
      return pageSeoOverrides[relativePath.value] || null;
    }

    function normalizeText(text) {
      return (text || "").replace(/\s+/g, " ").trim();
    }

    function truncateText(text, length = 160) {
      if (text.length <= length) {
        return text;
      }

      return `${text.slice(0, length - 1).trim()}…`;
    }

    function inferDescription() {
      const pageSeoOverride = getPageSeoOverride();
      const overrideDescription = normalizeText(pageSeoOverride?.description);

      if (overrideDescription) {
        return truncateText(overrideDescription);
      }

      const explicitDescription = normalizeText(
        frontmatter.value.description || page.value.description,
      );

      if (explicitDescription) {
        return truncateText(explicitDescription);
      }

      const selectors = [
        ".home .hero .tagline",
        ".home .hero .description",
        ".content:not(.custom) p",
        ".VPDoc p",
        "main p",
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        const text = normalizeText(element?.textContent || "");

        if (text) {
          return truncateText(text);
        }
      }

      return localeMessages[localeKey.value].description;
    }

    function resolveTitle() {
      const pageSeoOverride = getPageSeoOverride();
      const pathname = window.location.pathname;
      const isHomePath =
        pathname === "/" ||
        pathname === "/index.html" ||
        pathname === "/en/" ||
        pathname === "/en/index.html";

      if (isHomePath) {
        return localeMessages[localeKey.value].title;
      }

      const pageTitle = normalizeText(
        pageSeoOverride?.title || frontmatter.value.title || page.value.title,
      );

      if (!pageTitle || pageTitle === "Home" || pageTitle === "首页") {
        return site.value.title;
      }

      if (pageTitle.includes(site.value.title)) {
        return pageTitle;
      }

      return `${pageTitle} | ${site.value.title}`;
    }

    function ensureHeadElement(selector, tagName, attributes) {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement(tagName);
        document.head.appendChild(element);
      }

      Object.entries(attributes).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          element.removeAttribute(key);
          return;
        }

        element.setAttribute(key, value);
      });

      return element;
    }

    function updateMeta(name, content, attribute = "name") {
      return ensureHeadElement(`meta[${attribute}="${name}"]`, "meta", {
        [attribute]: name,
        content,
      });
    }

    function updateLink(rel, href, extra = {}) {
      return ensureHeadElement(`link[rel="${rel}"]`, "link", {
        rel,
        href,
        ...extra,
      });
    }

    function updateAlternateLink(hreflang, href) {
      return ensureHeadElement(
        `link[rel="alternate"][hreflang="${hreflang}"]`,
        "link",
        {
          rel: "alternate",
          hreflang,
          href,
        },
      );
    }

    function resolveCanonicalUrl() {
      const pageSeoOverride = getPageSeoOverride();
      const currentUrl = pageSeoOverride?.canonicalPath
        ? new URL(pageSeoOverride.canonicalPath, window.location.origin)
        : new URL(window.location.href);

      if (currentUrl.pathname.endsWith("/index.html")) {
        currentUrl.pathname = currentUrl.pathname.replace(
          /\/index\.html$/,
          "/",
        );
      }

      currentUrl.hash = "";

      return currentUrl.toString();
    }

    function resolveLocaleUrl(targetLocale) {
      const currentUrl = new URL(resolveCanonicalUrl());
      const pathname = currentUrl.pathname;

      if (targetLocale === "en") {
        if (pathname.startsWith("/en/")) {
          return currentUrl.toString();
        }

        currentUrl.pathname =
          pathname === "/"
            ? "/en/"
            : `/en${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

        return currentUrl.toString();
      }

      if (pathname.startsWith("/en/")) {
        currentUrl.pathname = pathname.replace(/^\/en/, "") || "/";
      }

      return currentUrl.toString();
    }

    function updateStructuredData(title, description, canonicalUrl) {
      const siteUrl = theme.value.siteUrl || canonicalUrl;
      const locale = localeMessages[localeKey.value];
      const searchPath = localeKey.value === "en" ? "/en/search/" : "/search/";
      const isHomePath =
        canonicalUrl.endsWith("/en/") || canonicalUrl.endsWith("/");
      const data = isHomePath
        ? {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.value.title,
            url:
              localeKey.value === "en"
                ? resolveLocaleUrl("en")
                : resolveLocaleUrl("zh"),
            inLanguage: locale.language,
            description,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}${searchPath}?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            url: canonicalUrl,
            inLanguage: locale.language,
            description,
            isPartOf: {
              "@type": "WebSite",
              name: site.value.title,
              url: siteUrl,
            },
          };

      let script = document.head.querySelector(
        'script[data-magic-seo="structured-data"]',
      );

      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-magic-seo", "structured-data");
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(data);
    }

    function syncUiAccessibility() {
      document.documentElement.lang = localeMessages[localeKey.value].language;

      const logoLink = document.querySelector(".nav-bar-title");

      if (logoLink) {
        logoLink.setAttribute("aria-label", site.value.title);
      }

      const searchInput = document.querySelector(".magic-doc-search__input");

      if (searchInput) {
        searchInput.setAttribute("inputmode", "search");
        searchInput.setAttribute("enterkeyhint", "search");
        searchInput.setAttribute("autocapitalize", "off");
        searchInput.setAttribute("autocomplete", "off");
      }

      const heroImage =
        document.querySelector(".home-hero .image") ||
        document.querySelector(".home .hero img");

      if (heroImage) {
        heroImage.setAttribute("alt", localeMessages[localeKey.value].imageAlt);
        heroImage.setAttribute("decoding", "async");
        heroImage.setAttribute("fetchpriority", "high");
      }
    }

    function syncHead() {
      if (typeof window === "undefined") {
        return;
      }

      const title = resolveTitle();
      const description = inferDescription();
      const canonicalUrl = resolveCanonicalUrl();
      const pageSeoOverride = getPageSeoOverride();
      const locale = localeMessages[localeKey.value];
      const socialImage = theme.value.socialImage;
      const alternateZhUrl = resolveLocaleUrl("zh");
      const alternateEnUrl = resolveLocaleUrl("en");
      const robotsContent = pageSeoOverride?.noindex
        ? "noindex,follow,max-image-preview:large"
        : "index,follow,max-image-preview:large";

      document.title = title;

      updateMeta("description", description);
      updateMeta("robots", robotsContent);
      updateMeta("og:title", title, "property");
      updateMeta("og:description", description, "property");
      updateMeta("og:type", "website", "property");
      updateMeta("og:site_name", site.value.title, "property");
      updateMeta("og:url", canonicalUrl, "property");
      updateMeta("og:locale", locale.locale, "property");
      updateMeta("twitter:title", title);
      updateMeta("twitter:description", description);
      updateMeta("twitter:card", "summary_large_image");

      if (socialImage) {
        updateMeta("og:image", socialImage, "property");
        updateMeta("twitter:image", socialImage);
      }

      updateLink("canonical", canonicalUrl);
      updateAlternateLink("zh-CN", alternateZhUrl);
      updateAlternateLink("en-US", alternateEnUrl);
      updateAlternateLink("x-default", alternateZhUrl);
      updateStructuredData(title, description, canonicalUrl);
      syncUiAccessibility();
    }

    function scheduleSync() {
      nextTick(syncHead);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(syncHead);
      });
      window.setTimeout(syncHead, 120);
    }

    watch(
      () => [
        page.value.relativePath,
        page.value.title,
        page.value.description,
        frontmatter.value.description,
        site.value.lang,
      ],
      () => {
        if (typeof window === "undefined") {
          return;
        }

        scheduleSync();
      },
      { immediate: true },
    );

    onMounted(() => {
      scheduleSync();
    });

    return () => null;
  },
});
</script>
