---
home: true
title: Magic Microservices
description: Official Magic Microservices documentation covering quick start, design philosophy, ecosystem, API, and playground for lightweight micro frontends built on Web Components.
heroImage: https://sf16-sg.tiktokcdn.com/obj/eden-sg/lpqulynulog/Magic/logo.qW4rU0mH6aL8.svg
heroText: Magic Microservices
tagline: A lightweight micro frontend factory built on Web Components
actionText: Get Started →
actionLink: /en/guide/getting-started
altActionText: Open Playground →
altActionLink: /en/playground/
features:
  - title: Framework Freedom
    details: Package and reuse micro applications across React, Vue, vanilla JS, and any other framework.
  - title: Tiny Runtime
    details: Keep the runtime small and adoption incremental instead of forcing a heavy platform layer.
  - title: Progressive Migration
    details: Let new modules live next to legacy systems and replace old implementations step by step.
  - title: Web Components Native
    details: Build on Custom Elements and Shadow DOM so the browser stays your real runtime boundary.
---

## Micro frontends without the platform tax

single-spa shows that frontend microservices can combine multiple applications on one page while allowing teams to keep framework freedom. Magic pushes that idea toward an even smaller abstraction: register your module as a browser-native custom element and use it directly.

You do not need to introduce a large application orchestration layer first. As long as your module follows the Magic lifecycle contract, it can be consumed just like `<user-profile-card />`.

Magic is intentionally not a heavier platform. It stays as a thin bridge built on browser-native primitives so teams can align on module boundaries and delivery contracts without forcing the same framework everywhere.

## Online Playground

If you want to try Magic before reading further, jump into the Playground. It gathers three real examples for the smallest registration loop, `useProps()` reference passing, and module-level composition, all editable directly inside the docs.

<div class="magic-cta-row">
  <a class="magic-cta-button" href="./playground/">Open Playground →</a>
</div>

## Capability map

- **Wrap modules**: turn existing React, Vue, or vanilla JS modules into Magic Modules with bootstrap, mount, updated, and unmount hooks
- **Register apps**: use `magic()` to register a module as a Custom Element from local packages, UMD, ESM, or SystemJS sources
- **Pass data**: use `propTypes` and `useProps()` to safely pass strings, booleans, numbers, and reference values
- **Adopt incrementally**: embed new capabilities at component level, which works well for micro frontends, service-oriented widgets, and mixed framework stacks

## Why teams choose Magic

Magic does not try to own your entire frontend platform. It gives you a compact and stable kernel so teams can focus on module boundaries, deployment strategy, and collaboration.

- Friendly to legacy systems because it supports gradual adoption
- Framework-neutral because different implementations can coexist on the same page
- Direct to deliver because the final contract is a native HTML tag
- Easy to reason about because lifecycle boundaries stay explicit

## Design principles

- **Web Components Plus**: keep Custom Elements as the native delivery contract while extending data passing with `useProps()` for reference values
- **Thin bridge**: Magic focuses on the minimal runtime loop and leaves heavy orchestration and product-specific composition to upper layers
- **Modules as units**: a micro frontend does not need to be a whole app, because a widget, panel, or remote module can all be first-class delivery units
- **Framework flattening**: authors keep their preferred framework while consumers integrate through a stable HTML tag and lifecycle contract

Read next:

- [Design Philosophy](./guide/design-philosophy)
- [Core Capabilities](./guide/core-capabilities)
- <a href="/en/ecosystem/">Ecosystem Extensions</a>
- [Core Concepts](./guide/core-concepts)
- [Props & Data Flow](./guide/props)

## Start in three steps

1. Load the runtime
2. Register your module
3. Use the HTML tag

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
<script>
  magic('custom-component', {
    mount: (container) => (container.innerHTML = 'Hello magic!'),
  })
</script>

<custom-component></custom-component>
```

Read next:

- [Getting Started](./guide/getting-started)
- [Core Concepts](./guide/core-concepts)
- [magic() API](./api/magic)
