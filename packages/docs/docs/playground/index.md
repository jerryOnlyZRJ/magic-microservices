---
title: Playground
description: 在文档站内直接体验 Magic 的注册闭环、useProps 引用透传、模块级组合以及各 adapter 的默认 demo。
---

# Playground

这里把 Magic 最适合上手体验的三个示例聚合到了一起。你可以直接在文档站里改代码、看效果，再决定回头深入阅读哪一层文档。

## 你可以在这里做什么

- 体验最小注册闭环，理解 `magic()` 如何把模块注册成浏览器原生标签
- 修改 `useProps()` 回调逻辑，观察引用类型如何透传
- 调整模块级组合示例，理解为什么 Magic 更偏向“模块交付”而不是“应用编排”
- 对照 adapters 中的每一个框架适配器，体验 React 18、React 17、Preact、Vue 3 与 Svelte 对应的默认 demo

## 最小注册闭环

<MagicPlayground demo="hello-card" />

## useProps 引用透传

<MagicPlayground demo="use-props-callback" />

## 模块级组合

<MagicPlayground demo="module-composition" />

## Adapter 框架 Demo

### React 18

<MagicPlayground demo="adapter-react18" />

### React 17

<MagicPlayground demo="adapter-react17" />

### Preact

<MagicPlayground demo="adapter-preact" />

### Vue 3

<MagicPlayground demo="adapter-vue3" />

### Svelte

<MagicPlayground demo="adapter-svelte" />

## 从 Playground 回到文档

- 想理解设计判断：阅读 [设计理念](../guide/design-philosophy)
- 想理解最小能力闭环：阅读 [核心能力](../guide/core-capabilities)
- 想理解扩展边界：阅读 <a href="/ecosystem/">生态扩展</a>
