const defaultRepository = "jerryOnlyZRJ/magic-microservices";
const repository = process.env.GITHUB_REPOSITORY || defaultRepository;
const repositoryOwner = repository.split("/")[0] || "jerryOnlyZRJ";
const repoName = repository.split("/")[1] || "magic-microservices";
const isUserPagesRepository = repoName.endsWith(".github.io");
const socialImage =
  "https://sf16-sg.tiktokcdn.com/obj/eden-sg/lpqulynulog/Magic/logo.qW4rU0mH6aL8.svg";
const siteUrl =
  process.env.SITE_URL ||
  `https://${repositoryOwner.toLowerCase()}.github.io${
    isUserPagesRepository ? "" : `/${repoName}`
  }`;
const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION ||
  "SDkm2bW7CKiVVYBo5trHf6BspGWweJKfGuk-XJ9dRZg";
const bingVerification = process.env.BING_SITE_VERIFICATION || "";
const base =
  process.env.GITHUB_ACTIONS === "true" && !isUserPagesRepository
    ? `/${repoName}/`
    : "/";

const zhGuideSidebar = [
  {
    text: "指南",
    children: [
      { text: "快速开始", link: "/guide/getting-started" },
      { text: "核心概念", link: "/guide/core-concepts" },
      { text: "设计理念", link: "/guide/design-philosophy" },
      { text: "核心能力", link: "/guide/core-capabilities" },
      { text: "生命周期", link: "/guide/lifecycle" },
      { text: "Props 与数据传递", link: "/guide/props" },
      { text: "模块注册", link: "/guide/register" },
    ],
  },
];

const zhEcosystemSidebar = [{ text: "生态扩展", link: "/ecosystem/" }];

const zhApiSidebar = [
  {
    text: "API",
    children: [
      { text: "magic()", link: "/api/magic" },
      { text: "useProps()", link: "/api/use-props" },
    ],
  },
];

const enGuideSidebar = [
  {
    text: "Guide",
    children: [
      { text: "Getting Started", link: "/en/guide/getting-started" },
      { text: "Core Concepts", link: "/en/guide/core-concepts" },
      { text: "Design Philosophy", link: "/en/guide/design-philosophy" },
      { text: "Core Capabilities", link: "/en/guide/core-capabilities" },
      { text: "Lifecycle", link: "/en/guide/lifecycle" },
      { text: "Props & Data Flow", link: "/en/guide/props" },
      { text: "Module Registration", link: "/en/guide/register" },
    ],
  },
];

const enEcosystemSidebar = [{ text: "Ecosystem", link: "/en/ecosystem/" }];

const enApiSidebar = [
  {
    text: "API",
    children: [
      { text: "magic()", link: "/en/api/magic" },
      { text: "useProps()", link: "/en/api/use-props" },
    ],
  },
];

module.exports = {
  base,
  lang: "zh-CN",
  title: "Magic Microservices",
  description: "基于 Web Components 的轻量级微前端工厂函数",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "Magic Microservices",
      description: "基于 Web Components 的轻量级微前端工厂函数",
    },
    "/en/": {
      lang: "en-US",
      title: "Magic Microservices",
      description:
        "A lightweight micro frontend factory built on Web Components",
    },
  },
  head: [
    [
      "link",
      {
        rel: "icon",
        href: socialImage,
      },
    ],
    ["meta", { name: "theme-color", content: "#5b6cff" }],
    [
      "meta",
      { name: "robots", content: "index,follow,max-image-preview:large" },
    ],
    ["meta", { name: "format-detection", content: "telephone=no" }],
    ["meta", { property: "og:site_name", content: "Magic Microservices" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:image", content: socialImage }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:image", content: socialImage }],
    ["link", { rel: "canonical", href: siteUrl }],
    ["link", { rel: "sitemap", href: `${siteUrl}/sitemap.xml` }],
    ...(googleVerification
      ? [
          [
            "meta",
            { name: "google-site-verification", content: googleVerification },
          ],
        ]
      : []),
    ...(bingVerification
      ? [["meta", { name: "msvalidate.01", content: bingVerification }]]
      : []),
  ],
  themeConfig: {
    logo: socialImage,
    repo: repository,
    siteUrl,
    socialImage,
    docsDir: "packages/docs/docs",
    docsBranch: "main",
    editLinks: true,
    locales: {
      "/": {
        label: "简体中文",
        selectText: "语言",
        nav: [
          { text: "首页", link: "/", activeMatch: "^/$" },
          {
            text: "指南",
            link: "/guide/getting-started",
            activeMatch: "^/guide/",
          },
          {
            text: "生态扩展",
            link: "/ecosystem/",
            activeMatch: "^/ecosystem/",
          },
          {
            text: "Playground",
            link: "/playground/",
            activeMatch: "^/playground/",
          },
          { text: "API", link: "/api/magic", activeMatch: "^/api/" },
        ],
        sidebar: {
          "/guide/": zhGuideSidebar,
          "/ecosystem/": zhEcosystemSidebar,
          "/api/": zhApiSidebar,
        },
        editLinkText: "在 GitHub 上编辑此页",
        lastUpdated: "最近更新",
      },
      "/en/": {
        label: "English",
        selectText: "Languages",
        nav: [
          { text: "Home", link: "/en/", activeMatch: "^/en/$" },
          {
            text: "Guide",
            link: "/en/guide/getting-started",
            activeMatch: "^/en/guide/",
          },
          {
            text: "Ecosystem",
            link: "/en/ecosystem/",
            activeMatch: "^/en/ecosystem/",
          },
          {
            text: "Playground",
            link: "/en/playground/",
            activeMatch: "^/en/playground/",
          },
          { text: "API", link: "/en/api/magic", activeMatch: "^/en/api/" },
        ],
        sidebar: {
          "/en/guide/": enGuideSidebar,
          "/en/ecosystem/": enEcosystemSidebar,
          "/en/api/": enApiSidebar,
        },
        editLinkText: "Edit this page on GitHub",
        lastUpdated: "Last Updated",
      },
    },
  },
};
