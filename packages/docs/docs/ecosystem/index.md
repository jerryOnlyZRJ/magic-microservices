---
title: 生态扩展
description: 深入了解 Magic 的 adapters、生态边界、选型建议、常见坑与 Playground demo，帮助团队构建可扩展的微前端交付体系。
---

# 生态扩展

如果说设计理念回答的是“为什么要这样设计”，核心能力回答的是“最小闭环是什么”，那么生态扩展层回答的就是：**当团队开始规模化使用 Magic 时，它如何继续向上生长。**

Magic 不把所有能力都塞进 Core，而是通过清晰边界，把运行时稳定性留给底层，把框架适配、工程接入和上层方案留给生态。

<div id="overview"></div>

## 生态全景

### 生态扩展回答什么问题

- 当宿主越来越多、框架越来越杂时，如何保持统一的模块交付协议
- 当团队进入规模化协作时，如何让 Core 保持稳定、让扩展保持灵活
- 当业务需要升级框架、接入插件、做 SSR 或在线调试时，哪些能力应该放在 adapter 与工程层处理

### Adapter 生态总览

当 Magic 进入多团队、多框架协作阶段，最先被团队感知到的生态能力通常不是 CLI，而是 adapters。它们把不同框架的组件模型翻译成同一套 Magic 生命周期协议，让消费方继续只面对 HTML 标签。

<div class="magic-adapter-grid">
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-react</p>
    <h3>React 18+</h3>
    <p>面向现代 React 应用，使用 createRoot / hydrateRoot，把并发模式与浏览器原生标签交付结合起来。</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-react17</p>
    <h3>React 17</h3>
    <p>服务历史 React 工程，继续沿用 render / hydrate / unmountComponentAtNode 这套运行时协议。</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-preact</p>
    <h3>Preact</h3>
    <p>面向轻量场景，复用 h / render / cloneElement，适合对包体与启动开销敏感的宿主环境。</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-vue3</p>
    <h3>Vue 3</h3>
    <p>把 createApp 与 h 渲染流程接到 Magic 生命周期上，保留 Vue 组件与应用实例的扩展能力。</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-svelte</p>
    <h3>Svelte</h3>
    <p>消费 Svelte 编译后的组件实例协议，依赖 target / $set / $destroy 这组稳定合约完成接入。</p>
  </article>
</div>

### Core 与扩展的边界

Magic Core 负责的是最小运行时闭环：

- 把模块注册成 Custom Element
- 管理生命周期
- 维护 Props 契约与引用类型透传

Core 不主动接管业务编排、工程适配和运行时策略。这样做的价值，是让底层保持稳定，把真正变化快、差异大的逻辑放到上层扩展里。

<div id="selection"></div>

## 选型与边界

### 为什么 adapters 是生态扩展层的重点

适配器层承接的是“框架差异”而不是“业务差异”。它的目标不是创造新的开发模型，而是把各框架已有的组件模型映射到 Magic 的统一模块协议：

- 宿主方继续消费 `<user-card />` 这样的原生标签
- 开发方继续留在自己熟悉的框架心智里
- 生命周期统一映射到 `mount / updated / unmount`
- 框架升级、SSR、hydrate 等差异由 adapter 层吸收

这种边界与六边形架构的思想很接近：核心逻辑不依赖外部接入方式，但可以通过 adapter 连接不同运行环境。

### Adapter 能力矩阵

| Adapter | 适用框架 | 核心能力 | 典型场景 |
| --- | --- | --- | --- |
| `magic-react` | React 18+ | `createRoot` / `hydrateRoot`、并发模式兼容、root 实例管理 | 新项目、渐进式升级到 React 18 的宿主 |
| `magic-react17` | React 17 | `render` / `hydrate` / `unmountComponentAtNode` | 存量 React 17 应用、暂不升级的业务 |
| `magic-preact` | Preact | `h` / `render` / `cloneElement`、轻量 vnode 更新 | 对体积敏感的小型模块、嵌入式场景 |
| `magic-vue3` | Vue 3 | `createApp` / `h`、应用实例接管、`handleApp` 扩展 | 需要挂插件、指令、全局组件的 Vue 模块 |
| `magic-svelte` | Svelte | `target` / `$set` / `$destroy` 实例协议 | 基于编译产物交付、偏组件分发的 Svelte 模块 |

### 选型速查

- **优先选 React 18 adapter**：如果你的宿主和模块已经在 React 18 生态里，且需要 SSR / hydrate 的升级空间。
- **保留 React 17 adapter**：如果你当前核心诉求是统一交付协议，而不是立刻完成框架升级。
- **选择 Preact adapter**：如果模块体积和启动开销比生态兼容性更重要，尤其适合小部件和嵌入式场景。
- **选择 Vue 3 adapter**：如果你需要保留插件、指令、全局组件和 provide/inject 这些 app 级能力。
- **选择 Svelte adapter**：如果模块本身就是以编译产物交付，追求极简运行时和最少桥接层。

<div id="adapter-details"></div>

## Adapter 逐个上手

### React 18 Adapter

**能力重点**

- 使用 `createRoot` 挂载 React 18 组件
- 支持通过 `renderType: "hydrate"` 切换到 `hydrateRoot`
- 使用 root 实例映射管理卸载流程，避免宿主直接感知 React 运行时细节

**使用方式**

```ts
import React from "react";
import * as ReactDOM from "react-dom/client";
import magic from "@magic-microservices/magic";
import magicReact from "@magic-microservices/magic-react";

const module = magicReact({
  React,
  ReactDOM,
  component: UserCard,
});

magic("user-card", module, {
  propTypes: {
    name: String,
  },
});
```

**选型建议**

- 适合现代 React 新项目，尤其是已经全面使用 React 18 API 的模块
- 适合需要保留 hydrate 入口、计划逐步走向 SSR 的团队
- 适合希望把 React 运行时细节完全隐藏在 adapter 后面的宿主体系

**常见坑**

- 不要把 `react-dom` 当成 `ReactDOM` 传入，这里需要的是 `react-dom/client`
- 只有在服务端已经输出对应标记时才应该使用 `renderType: "hydrate"`
- 同一个模块不要在运行过程中来回切换 render 与 hydrate 策略

**Playground demo**

- [React 18 Adapter Demo](../playground/#react-18)

### React 17 Adapter

**能力重点**

- 沿用 React 17 时代的 `render` / `hydrate`
- 适合历史应用平滑接入，不要求先完成 React 18 升级
- 卸载阶段调用 `unmountComponentAtNode`

**使用方式**

```ts
import React from "react";
import ReactDOM from "react-dom";
import magic from "@magic-microservices/magic";
import magicReact from "@magic-microservices/magic-react17";

const module = magicReact({
  React,
  ReactDOM,
  component: LegacyPanel,
});

magic("legacy-panel", module);
```

**选型建议**

- 适合仍然运行在 React 17 的存量系统
- 适合当前优先统一模块交付方式、后续再推动 React 18 升级的团队
- 适合已有大量历史组件、不希望一次性重构挂载逻辑的场景

**常见坑**

- 包名是 `@magic-microservices/magic-react17`，不要误用 React 18 adapter
- 不要把并发特性、`createRoot` 之类的 React 18 心智带进这个 adapter
- 如果后续要迁移到 React 18，最好先清理对 `hydrate` 历史用法的依赖

**Playground demo**

- [React 17 Adapter Demo](../playground/#react-17)

### Preact Adapter

**能力重点**

- 使用 `h` 构建 vnode，使用 `cloneElement` 做增量 props 更新
- 复用 Preact 的轻量运行时，适合嵌入式和体积敏感场景
- 对外仍保持 Magic 一致的模块接口

**使用方式**

```ts
import * as preact from "preact";
import magic from "@magic-microservices/magic";
import magicPreact from "@magic-microservices/magic-preact";

const module = magicPreact({
  preact,
  component: TinyCard,
});

magic("tiny-card", module);
```

**选型建议**

- 适合做被嵌入到复杂宿主中的轻量模块
- 适合对 bundle size、首屏启动和运行时开销更敏感的业务
- 适合偏组件分发而非大应用编排的交付模型

**常见坑**

- 不要把“React 语法兼容”误解成“React 生态完全等价”，第三方库兼容性需要单独验证
- 记得传入完整 `preact` 命名空间，而不是只传某几个函数
- 如果模块依赖大量 React 专属生态，通常 React adapter 会更稳妥

**Playground demo**

- [Preact Adapter Demo](../playground/#preact)

### Vue 3 Adapter

**能力重点**

- 基于 `createApp` 与 `h` 创建 Vue 运行时实例
- 允许通过 `handleApp` 注入插件、全局组件、指令
- props 更新会映射到 Vue 组件实例刷新流程

**使用方式**

```ts
import * as Vue from "vue";
import magic from "@magic-microservices/magic";
import magicVue3 from "@magic-microservices/magic-vue3";

const module = magicVue3({
  Vue,
  component: UserPanel,
  handleApp(app) {
    app.provide("theme", "dark");
  },
});

magic("user-panel", module);
```

**选型建议**

- 适合已经沉淀了 Vue 3 组件体系和插件体系的团队
- 适合需要在模块级别仍然使用 provide/inject、指令和全局组件的场景
- 适合希望保留 Vue 应用实例接管能力，而不仅是简单渲染单个组件

**常见坑**

- `handleApp` 里的插件注册必须在挂载前完成，不要把异步初始化拖得过长
- 组件 props 命名要和外部传入属性保持一致，否则更新链路会变得难排查
- 如果模块只是非常轻量的展示卡片，不一定需要 Vue app 级能力，需权衡运行时成本

**Playground demo**

- [Vue 3 Adapter Demo](../playground/#vue-3)

### Svelte Adapter

**能力重点**

- 不依赖虚拟 DOM，而是直接消费 Svelte 组件实例协议
- 只要求组件支持 `target`、`$set`、`$destroy`
- 很适合“编译后即交付”的 Svelte 组件模型

**使用方式**

```ts
import magic from "@magic-microservices/magic";
import magicSvelte from "@magic-microservices/magic-svelte";
import ProfileCard from "./ProfileCard.svelte";

const module = magicSvelte({
  component: ProfileCard,
});

magic("profile-card", module);
```

**选型建议**

- 适合把 Svelte 编译产物作为远端模块直接交付的团队
- 适合追求极简运行时桥接层、希望减少包装代码的场景
- 适合模块本身就是组件交付单元，而不是完整应用容器

**常见坑**

- 确保你产出的是浏览器可挂载的 Svelte 组件，而不是仅供 SSR 的产物
- 注意不同版本 Svelte 对组件实例 API 的差异，交付前最好统一编译策略
- 如果模块需要复杂的 app 级插件体系，Svelte adapter 通常不会像 Vue 3 那样提供同等入口

**Playground demo**

- [Svelte Adapter Demo](../playground/#svelte)

<div id="tooling"></div>

## 工程化入口与生态演进

### 从文档跳到可运行示例

- [Playground](../playground/) 里已经为每个 adapter 提供了对应 demo
- React 18 / React 17 / Preact / Vue 3 / Svelte 都可以在文档站里直接改代码验证
- 如果你要先确认“该选哪个 adapter”，建议先看本页；如果你要先确认“运行时长什么样”，建议直接进 Playground

### CLI 与模板是工程化入口

生态扩展不只有运行时插件，也包括工程化工具链。

- CLI 负责降低初始化门槛
- 模板负责把构建配置、模块规范和项目结构沉淀成可复用脚手架
- 文档站负责把设计判断、运行时能力和最佳实践持续对齐

这样一来，Magic 不只是一个函数，而是一套可以逐步长成团队方案的基础设施底座。

### 真实 Demo：模块级组合

这个示例展示了 Magic 更偏模块级交付而不是应用级编排的特点。你可以直接修改两个模块的实现，观察它们像原生标签一样协作。

<MagicPlayground demo="module-composition" />

### 生态演进的方向

围绕当前的设计边界，Magic 的生态可以继续往几个方向扩展：

- **运行时增强**：更丰富的事件流、沙箱、远端资源治理
- **工程适配**：面向不同框架和宿主场景的适配器
- **开发体验**：CLI、模板、调试能力、在线 Playground
- **业务方案**：在 Magic Core 之上封装更贴近业务的微前端方案

这也是为什么 Magic 更像一个 Meta Framework：它不是要垄断一整套生态，而是要成为不同生态之间的连接层。

### 接下来读什么

- [设计理念](../guide/design-philosophy)
- [核心能力](../guide/core-capabilities)
- [模块注册](../guide/register)
- [Props 与数据传递](../guide/props)
