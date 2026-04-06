# Design Philosophy

Magic is more than a utility that registers modules as Custom Elements. It carries a clear set of design decisions: **push micro frontend delivery back toward browser-native abstractions, reduce framework differences to a shared contract, and leave higher-level composition to product teams and ecosystem extensions.**

## Why Magic exists

Many micro frontend solutions focus on application orchestration. They are strong at host-child app coordination, routing, and full-page composition. In real product teams, however, the common need is often smaller and more incremental:

- ship a capability independently without rebuilding the whole platform
- reuse implementations from different frameworks inside the same host
- consume modules with a simple browser-native contract instead of a large integration protocol

Magic compresses that problem into a smaller model: **transform a module, register it, and use it.**

## Web Components Plus

Magic does not try to replace Web Components. It starts from them and adds carefully chosen enhancements.

- keep Custom Elements as the standard consumption format
- keep HTML tags as the delivery contract
- keep the browser as the real runtime boundary
- extend data passing so `Object` and `Function` references can move through the system safely

That is why `useProps()` matters. Magic does not want to serialize user data into a different shape just to pass it through attributes, because serialization breaks references, prototypes, and intent. The goal is to enhance the native model without distorting it.

## A thin bridge, not a heavy platform

Another core idea is that Magic should stay **thin**.

Unlike platform-owning solutions, Magic does not try to become a new all-in-one frontend platform. It behaves like a lightweight runtime primitive:

- one `magic()` call completes registration
- one lifecycle contract adapts existing module logic
- one HTML tag becomes the final consumption interface

This makes the learning curve incremental. You can understand the smallest loop first and already ship value. Only when you need more customization do you move on to plugins, event flows, sandboxes, and other advanced capabilities.

## JS modules are the unit, so granularity stays open

Magic does not assume a micro frontend must be an entire application. It treats any deliverable, mountable, reusable frontend module as a valid unit.

That means all of these can be micro frontends:

- a user profile widget
- a rich interactive panel
- a remotely loaded business module

This changes the conversation from app-level composition to capability-level delivery, which is often a better fit for gradual adoption and service-oriented frontend systems.

## Flatten framework boundaries instead of inventing a new framework

Magic is not trying to replace React, Vue, or Svelte. Its value is to **flatten the integration cost between them**.

You can think of it as a shared contract:

- component authors keep the framework that best fits their module
- consumers interact with a stable tag-based interface
- host systems no longer need framework-specific glue for every integration

That is what makes “write once, reuse anywhere” practical. The framework stops being the permanent architectural boundary for every module you want to share.

## Keep Core narrow and let Plugins extend

Magic also has a strong boundary between its kernel and its extensions: **Core owns the minimal Web Components runtime, while plugins own customization.**

This separation matters because:

- Core stays stable and easy to reason about
- Plugins remain free to handle adaptation, data transformation, runtime policies, sandboxing, and other custom needs

In that sense, Magic Plugins act like adapters. They connect different host expectations and engineering constraints to the same execution kernel instead of pushing every customization into the runtime itself.

## The Meta Framework direction

The long-term question behind Magic is not only “how do we register a component?” It is also: **how do we make frameworks stop being the first constraint in frontend collaboration?**

That is why Magic is closer to a Meta Framework:

- it does not aim to own an exclusive ecosystem
- it acts as connective tissue between framework ecosystems
- it lets teams choose the best implementation per scenario
- it reduces the cost of cross-framework reuse and composition

This is not an invitation to mix technologies without discipline. Magic gives teams the freedom to cross boundaries when it creates value, not a reason to remove engineering judgment. The real payoff comes when architecture choices are driven by product needs, performance targets, and collaboration constraints instead of framework lock-in.

## Recommended reading path

If you are new to Magic, continue in this order:

- read [Core Capabilities](./core-capabilities) to understand the minimal runtime loop
- read [Core Concepts](./core-concepts) for the minimal model
- read [Lifecycle](./lifecycle) to understand host-module interaction
- read [Props & Data Flow](./props) to see why `useProps()` is a key enhancement
- read <a href="/en/ecosystem/">Ecosystem Extensions</a> to see how Core, plugins, CLI, and higher-level solutions stay separated
- read [Module Registration](./register) to connect local and remote modules in practice
