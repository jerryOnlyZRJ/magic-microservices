const defaultRepository = 'jerryOnlyZRJ/magic-microservices'
const repository = process.env.GITHUB_REPOSITORY || defaultRepository
const repoName = repository.split('/')[1] || 'magic-microservices'
const isUserPagesRepository = repoName.endsWith('.github.io')
const base = process.env.GITHUB_ACTIONS === 'true' && !isUserPagesRepository ? `/${repoName}/` : '/'

const zhGuideSidebar = [
  {
    text: '指南',
    children: [
      { text: '快速开始', link: '/guide/getting-started' },
      { text: '核心概念', link: '/guide/core-concepts' },
      { text: '生命周期', link: '/guide/lifecycle' },
      { text: 'Props 与数据传递', link: '/guide/props' },
      { text: '模块注册', link: '/guide/register' },
    ],
  },
]

const zhApiSidebar = [
  {
    text: 'API',
    children: [
      { text: 'magic()', link: '/api/magic' },
      { text: 'useProps()', link: '/api/use-props' },
    ],
  },
]

const enGuideSidebar = [
  {
    text: 'Guide',
    children: [
      { text: 'Getting Started', link: '/en/guide/getting-started' },
      { text: 'Core Concepts', link: '/en/guide/core-concepts' },
      { text: 'Lifecycle', link: '/en/guide/lifecycle' },
      { text: 'Props & Data Flow', link: '/en/guide/props' },
      { text: 'Module Registration', link: '/en/guide/register' },
    ],
  },
]

const enApiSidebar = [
  {
    text: 'API',
    children: [
      { text: 'magic()', link: '/en/api/magic' },
      { text: 'useProps()', link: '/en/api/use-props' },
    ],
  },
]

module.exports = {
  base,
  lang: 'zh-CN',
  title: 'Magic Microservices',
  description: '基于 Web Components 的轻量级微前端工厂函数',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Magic Microservices',
      description: '基于 Web Components 的轻量级微前端工厂函数',
    },
    '/en/': {
      lang: 'en-US',
      title: 'Magic Microservices',
      description: 'A lightweight micro frontend factory built on Web Components',
    },
  },
  head: [
    ['link', { rel: 'icon', href: 'https://sf16-sg.tiktokcdn.com/obj/eden-sg/lpqulynulog/Magic/logo.qW4rU0mH6aL8.svg' }],
    ['meta', { name: 'theme-color', content: '#5b6cff' }],
  ],
  themeConfig: {
    logo: 'https://sf16-sg.tiktokcdn.com/obj/eden-sg/lpqulynulog/Magic/logo.qW4rU0mH6aL8.svg',
    repo: repository,
    docsDir: 'packages/docs/docs',
    docsBranch: 'main',
    editLinks: true,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '语言',
        nav: [
          { text: '首页', link: '/', activeMatch: '^/$' },
          { text: '指南', link: '/guide/getting-started', activeMatch: '^/guide/' },
          { text: 'API', link: '/api/magic', activeMatch: '^/api/' },
        ],
        sidebar: {
          '/guide/': zhGuideSidebar,
          '/api/': zhApiSidebar,
        },
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '最近更新',
      },
      '/en/': {
        label: 'English',
        selectText: 'Languages',
        nav: [
          { text: 'Home', link: '/en/', activeMatch: '^/en/$' },
          { text: 'Guide', link: '/en/guide/getting-started', activeMatch: '^/en/guide/' },
          { text: 'API', link: '/en/api/magic', activeMatch: '^/en/api/' },
        ],
        sidebar: {
          '/en/guide/': enGuideSidebar,
          '/en/api/': enApiSidebar,
        },
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
      },
    },
  },
}
