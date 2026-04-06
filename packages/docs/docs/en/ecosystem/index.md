---
title: Ecosystem
description: Explore Magic adapters, ecosystem boundaries, selection advice, common pitfalls, and playground demos for scalable micro frontend delivery.
---

# Ecosystem

If the philosophy layer answers “why,” and the capability layer answers “what is the smallest useful runtime loop,” the ecosystem layer answers something else: **how does Magic keep growing once a team starts using it at scale.**

Magic does not stuff every concern into Core. It keeps runtime stability in the kernel and moves framework adaptation, engineering entry points, and higher-level solutions into the ecosystem layer.

<div id="overview"></div>

## Landscape

### What the ecosystem layer solves

- how to keep a unified delivery contract when hosts and frameworks keep multiplying
- how to let Core stay stable while extensions absorb fast-changing requirements
- where SSR, framework upgrades, plugin systems, and online demos should actually live

### Adapter ecosystem overview

Once Magic enters a multi-team, multi-framework environment, the first ecosystem layer most teams feel is not the CLI. It is the adapter layer. Adapters translate framework-specific component models into the same Magic lifecycle contract, while consumers still work with native HTML tags.

<div class="magic-adapter-grid">
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-react</p>
    <h3>React 18+</h3>
    <p>Built for modern React applications with createRoot / hydrateRoot, combining concurrent React with native-tag delivery.</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-react17</p>
    <h3>React 17</h3>
    <p>Serves legacy React systems that still depend on render / hydrate / unmountComponentAtNode.</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-preact</p>
    <h3>Preact</h3>
    <p>Targets lightweight environments by reusing h / render / cloneElement and keeping runtime overhead small.</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-vue3</p>
    <h3>Vue 3</h3>
    <p>Maps Vue 3 app creation and rendering flow onto Magic while preserving app-level extension points.</p>
  </article>
  <article class="magic-adapter-card">
    <p class="magic-adapter-card__eyebrow">@magic-microservices/magic-svelte</p>
    <h3>Svelte</h3>
    <p>Consumes the compiled Svelte component instance contract through target / $set / $destroy.</p>
  </article>
</div>

### The boundary between Core and extensions

Magic Core owns the minimal runtime loop:

- register modules as Custom Elements
- manage lifecycle boundaries
- handle prop contracts and reference-value delivery

Core does not try to own orchestration, engineering adaptation, or product-specific runtime policies. That keeps the kernel narrow and moves fast-changing concerns into the ecosystem.

<div id="selection"></div>

## Selection & Boundaries

### Why adapters are the key ecosystem layer

The adapter layer absorbs framework differences instead of business differences. It does not invent a new mental model for teams. It maps existing framework components onto the same Magic module contract:

- consumers still mount native tags such as `<user-card />`
- authors stay inside the framework they already know
- lifecycle differences are translated into `mount / updated / unmount`
- framework upgrades, SSR, and hydrate behavior are absorbed by the adapter

This is close to the spirit of hexagonal architecture: the core stays narrow while adapters connect it to different environments.

### Adapter capability matrix

| Adapter | Framework | Core capability | Typical use case |
| --- | --- | --- | --- |
| `magic-react` | React 18+ | `createRoot` / `hydrateRoot`, concurrent-ready mounting, root instance management | modern React modules, progressive React 18 migration |
| `magic-react17` | React 17 | `render` / `hydrate` / `unmountComponentAtNode` | legacy React applications that are not upgraded yet |
| `magic-preact` | Preact | `h` / `render` / `cloneElement`, lightweight vnode updates | size-sensitive widgets and embedded modules |
| `magic-vue3` | Vue 3 | `createApp` / `h`, app-level extension hooks, instance-driven updates | Vue modules that need plugins, directives, or provide/inject |
| `magic-svelte` | Svelte | `target` / `$set` / `$destroy` instance contract | compiled Svelte components delivered as reusable modules |

### Quick selection guide

- **Choose the React 18 adapter first** when your module already lives in the React 18 ecosystem and needs room for SSR or hydrate flows.
- **Keep the React 17 adapter** when delivery unification matters more than immediate framework migration.
- **Choose the Preact adapter** when runtime size and startup cost matter more than full ecosystem compatibility.
- **Choose the Vue 3 adapter** when you need plugins, directives, global components, or provide/inject at module level.
- **Choose the Svelte adapter** when your module is shipped as compiled component output with a minimal bridge.

<div id="adapter-details"></div>

## Adapter Deep Dive

### React 18 Adapter

**What it does well**

- mounts components with `createRoot`
- supports `renderType: "hydrate"` for `hydrateRoot` flows
- manages root instances so the host only sees the Magic lifecycle

**Usage**

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

**Selection advice**

- best for modern React modules that already rely on React 18 APIs
- best for teams that need a clean path to hydrate or SSR scenarios
- best when the host contract should stay free from React runtime details

**Common pitfalls**

- do not pass `react-dom` here; this adapter expects `react-dom/client`
- only use `renderType: "hydrate"` when matching server-rendered markup already exists
- avoid switching the same module back and forth between render and hydrate strategies

**Playground demo**

- [React 18 Adapter Demo](../playground/#react-18)

### React 17 Adapter

**What it does well**

- preserves the React 17 render model
- lets legacy applications adopt Magic before upgrading framework runtime
- unmounts through `unmountComponentAtNode`

**Usage**

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

**Selection advice**

- best for existing React 17 systems that are still in active use
- best when you want a unified delivery protocol first and a React 18 migration later
- best for teams with large legacy component inventories and limited appetite for mount refactors

**Common pitfalls**

- the package name is `@magic-microservices/magic-react17`; do not swap in the React 18 adapter by mistake
- do not expect concurrent features or `createRoot` semantics from this adapter
- if React 18 migration is on the roadmap, reduce historical `hydrate` assumptions early

**Playground demo**

- [React 17 Adapter Demo](../playground/#react-17)

### Preact Adapter

**What it does well**

- uses `h` to create vnode trees and `cloneElement` for prop updates
- keeps runtime size small without changing the Magic delivery contract
- works well for embedded or performance-sensitive UI fragments

**Usage**

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

**Selection advice**

- best for lightweight widgets embedded into larger host surfaces
- best when bundle size, startup cost, and runtime overhead are critical
- best when your delivery unit is a component or small panel rather than a full application shell

**Common pitfalls**

- React-like authoring does not mean full React ecosystem equivalence; validate third-party library compatibility
- pass the full `preact` namespace, not only a couple of helpers
- if the module depends heavily on React-specific ecosystem packages, the React adapters are usually safer

**Playground demo**

- [Preact Adapter Demo](../playground/#preact)

### Vue 3 Adapter

**What it does well**

- mounts through `createApp` and `h`
- exposes `handleApp` for plugins, directives, or app-level bootstrapping
- updates Vue component state through the Magic attribute pipeline

**Usage**

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

**Selection advice**

- best for teams already invested in Vue 3 component and plugin systems
- best when module-level provide/inject, directives, and global components still matter
- best when you want app-level extension hooks instead of only wrapping a single component

**Common pitfalls**

- finish plugin registration in `handleApp` before mount; avoid dragging app bootstrap into long async chains
- keep component prop names aligned with external attributes to make update behavior predictable
- if the module is only a tiny presentation card, app-level Vue power might be more than you need

**Playground demo**

- [Vue 3 Adapter Demo](../playground/#vue-3)

### Svelte Adapter

**What it does well**

- works directly with the compiled Svelte instance contract
- avoids a virtual DOM bridge entirely
- keeps the adapter contract minimal: `target`, `$set`, `$destroy`

**Usage**

```ts
import magic from "@magic-microservices/magic";
import magicSvelte from "@magic-microservices/magic-svelte";
import ProfileCard from "./ProfileCard.svelte";

const module = magicSvelte({
  component: ProfileCard,
});

magic("profile-card", module);
```

**Selection advice**

- best for teams distributing compiled Svelte components as remote modules
- best when you want the smallest bridge and the simplest runtime contract
- best when the module is fundamentally a component delivery unit instead of an app container

**Common pitfalls**

- make sure the output is a browser-mountable Svelte component, not SSR-only output
- watch for instance API differences across Svelte versions and keep the compile strategy consistent
- if the module needs rich app-level plugin composition, the Vue 3 adapter usually offers a broader entry surface

**Playground demo**

- [Svelte Adapter Demo](../playground/#svelte)

<div id="tooling"></div>

## Tooling & Evolution

### Jump from docs to runnable examples

- [Playground](../playground/) already includes one demo per adapter
- React 18, React 17, Preact, Vue 3, and Svelte examples can all be edited directly in the docs site
- use this page when you want to choose the right adapter, and use Playground when you want to inspect runtime behavior quickly

### CLI and templates are part of the ecosystem

The ecosystem is not only about runtime plugins. It also includes engineering entry points:

- CLI reduces setup cost
- templates turn build conventions and project structure into reusable scaffolds
- documentation keeps design decisions, runtime behavior, and best practices aligned

That is how Magic grows from a single runtime function into infrastructure that teams can keep building on.

### Live Demo: module-level composition

This example shows how Magic leans toward module-level delivery instead of full application orchestration. Edit both modules and see how they compose like native tags.

<MagicPlayground demo="module-composition" locale="en" />

### Where the ecosystem can evolve

Given the current boundaries, the ecosystem can keep growing in a few directions:

- **runtime enhancements**: richer event flows, sandboxes, remote asset governance
- **engineering adapters**: host-specific and framework-specific integration layers
- **developer experience**: CLI, templates, debugging support, online playgrounds
- **business solutions**: higher-level micro frontend products built on top of Magic Core

That is why Magic is closer to a Meta Framework than a closed ecosystem. It is meant to connect ecosystems, not replace them.

### Recommended follow-up reading

- [Design Philosophy](../guide/design-philosophy)
- [Core Capabilities](../guide/core-capabilities)
- [Module Registration](../guide/register)
- [Props & Data Flow](../guide/props)
