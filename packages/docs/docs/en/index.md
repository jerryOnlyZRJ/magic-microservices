---
home: true
heroImage: https://sf16-sg.tiktokcdn.com/obj/eden-sg/lpqulynulog/Magic/logo.qW4rU0mH6aL8.svg
heroText: Magic Microservices
tagline: A lightweight micro frontend factory built on Web Components
actionText: Get Started →
actionLink: /en/guide/getting-started
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

<div class="magic-home-section">

## Micro frontends without the platform tax

single-spa shows that frontend microservices can combine multiple applications on one page while allowing teams to keep framework freedom. Magic pushes that idea toward an even smaller abstraction: register your module as a browser-native custom element and use it directly.

You do not need to introduce a large application orchestration layer first. As long as your module follows the Magic lifecycle contract, it can be consumed just like `<user-profile-card />`.

</div>

<div class="magic-home-section">

## Capability map

<div class="magic-grid">
  <div class="magic-card">
    <h3>Wrap modules</h3>
    <p>Turn existing React, Vue, or vanilla JS modules into Magic Modules with bootstrap, mount, updated, and unmount hooks.</p>
  </div>
  <div class="magic-card">
    <h3>Register apps</h3>
    <p>Use <code>magic()</code> to register a module as a Custom Element from local packages, UMD, ESM, or SystemJS sources.</p>
  </div>
  <div class="magic-card">
    <h3>Pass data</h3>
    <p>Use <code>propTypes</code> and <code>useProps()</code> to safely pass strings, booleans, numbers, and reference values.</p>
  </div>
  <div class="magic-card">
    <h3>Adopt incrementally</h3>
    <p>Embed new capabilities at component level, which works well for micro frontends, service-oriented widgets, and mixed framework stacks.</p>
  </div>
</div>

</div>

<div class="magic-home-section">

## Why teams choose Magic

<div class="magic-highlight">
  <p>Magic does not try to own your entire frontend platform. It gives you a compact and stable kernel so teams can focus on module boundaries, deployment strategy, and collaboration.</p>
  <ul>
    <li>Friendly to legacy systems because it supports gradual adoption.</li>
    <li>Framework-neutral because different implementations can coexist on the same page.</li>
    <li>Direct to deliver because the final contract is a native HTML tag.</li>
    <li>Easy to reason about because lifecycle boundaries stay explicit.</li>
  </ul>
</div>

</div>

<div class="magic-home-section">

## Start in three steps

<div class="magic-pills">
  <span class="magic-pill">1. Load the runtime</span>
  <span class="magic-pill">2. Register your module</span>
  <span class="magic-pill">3. Use the HTML tag</span>
</div>

<div class="magic-code-block">

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
<script>
  magic('custom-component', {
    mount: (container) => (container.innerHTML = 'Hello magic!'),
  })
</script>

<custom-component></custom-component>
```

</div>

Read next:

- [Getting Started](./guide/getting-started)
- [Core Concepts](./guide/core-concepts)
- [magic() API](./api/magic)

</div>
