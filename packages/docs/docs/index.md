---
home: true
title: Magic Microservices
description: Magic Microservices 官方文档，覆盖快速开始、设计理念、生态扩展、API 与在线 Playground，帮助团队以 Web Components 方式落地轻量级微前端。
heroImage: https://sf16-sg.tiktokcdn.com/obj/eden-sg/lpqulynulog/Magic/logo.qW4rU0mH6aL8.svg
heroText: Magic Microservices
tagline: 基于 Web Components 的轻量级微前端工厂函数
actionText: 快速开始 →
actionLink: /guide/getting-started
altActionText: Playground →
altActionLink: /playground/
features:
  - title: Framework Freedom
    details: 在 React、Vue、原生 JS 或任意框架中封装与复用同一套微应用能力。
  - title: Tiny Runtime
    details: 运行时体积轻，适合渐进式接入，不会把你的主应用改造成重型平台工程。
  - title: Progressive Migration
    details: 让新模块与旧系统并行演进，用标准 Custom Element 逐步替换遗留实现。
  - title: Web Components Native
    details: 借助浏览器原生 Custom Elements 与 Shadow DOM，把微前端落到标准能力之上。
---

## 让微前端回到简单

single-spa 证明了前端微服务可以把多个应用组合到同一页面中，并且允许团队自由选择技术栈。Magic 则进一步把落地成本压缩到一个更小、更直接的抽象：把你的模块注册成浏览器原生支持的自定义元素。

这意味着你不必先搭建一套复杂的应用级编排层，也不需要把所有团队绑定在同一个框架约束里。只要你的模块符合 Magic 生命周期约定，它就可以像 `<user-profile-card />` 一样被消费。

Magic 的设计目标不是再造一个更重的前端平台，而是做一层足够薄的桥接层：用浏览器原生能力承接模块交付，用统一的标签协议抹平框架差异，让团队把注意力放在能力边界和业务组合上。

## 在线 Playground

如果你想先上手再读文档，可以直接进入 Playground。这里聚合了最小注册闭环、`useProps()` 引用类型透传以及模块级组合三个真实示例，支持在文档站内直接编辑代码和即时预览。

<div class="magic-cta-row">
  <a class="magic-cta-button" href="./playground/">立即体验 Playground →</a>
</div>

## 官方能力地图

- **封装模块**：把现有 React、Vue 或原生 JS 模块改造成符合 bootstrap / mount / updated / unmount 生命周期的 Magic Module
- **注册微应用**：通过 `magic()` 把模块注册成 Custom Element，可使用本地包、UMD、ESM 或 SystemJS 远端包
- **传递数据**：通过 `propTypes` 与 `useProps()` 支持字符串、布尔值、数字以及引用类型数据的安全透传
- **渐进式演进**：让新能力以组件粒度嵌入现有系统，适合微前端、组件服务化与多框架并存场景

## 为什么团队会选择 Magic

Magic 不是试图接管整个前端平台，而是提供一个足够小、足够稳定的能力内核，让团队把注意力放在业务模块拆分、部署边界和协作方式上。

- 对旧系统友好：可以在现有页面里逐步接入，不要求一次性重构
- 对框架中立：同一页面可以承载不同框架实现的微应用
- 对交付直接：最终产物就是浏览器可识别的 HTML 标签
- 对工程可控：模块生命周期清晰，便于管理挂载、副作用和卸载流程

## 设计理念

- **Web Components Plus**：保留浏览器原生 Custom Elements 的标准交付方式，同时用 `useProps()` 增强引用类型数据透传能力
- **薄桥接层**：Magic 只做运行时最小闭环，不强行接管应用级平台，把复杂编排和定制能力留给上层架构与生态扩展
- **模块即实体**：微前端粒度不再被整页应用限制，一个组件、一个面板、一个远端模块都可以成为独立交付单元
- **抹平框架**：开发方可以使用最适合自己的框架，消费方只需要遵循统一的 HTML 标签和生命周期约定

继续阅读：

- [设计理念](./guide/design-philosophy)
- [核心能力](./guide/core-capabilities)
- <a href="/ecosystem/">生态扩展</a>
- [核心概念](./guide/core-concepts)
- [Props 与数据传递](./guide/props)

## 三步接入

1. 引入 Magic Runtime
2. 注册你的微应用
3. 通过 HTML 标签直接使用

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
<script>
  magic('custom-component', {
    mount: (container) => (container.innerHTML = 'Hello magic!'),
  })
</script>

<custom-component></custom-component>
```

继续阅读：

- [快速开始](./guide/getting-started)
- [核心概念](./guide/core-concepts)
- [magic() API](./api/magic)
