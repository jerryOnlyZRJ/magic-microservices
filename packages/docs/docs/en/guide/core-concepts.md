# Core Concepts

Magic reduces micro frontend delivery to a clear three-part model: transform a module, register it, and use it. Behind that model is a broader design decision: **push delivery toward browser-native primitives, flatten framework differences into a shared tag contract, and keep advanced customization in upper layers instead of the kernel.**

## 1. Transform a module

Your business code can come from React, Vue, vanilla JS, or any DOM-capable implementation. To be driven by Magic, the module only needs to expose lifecycle hooks.

```typescript
interface Module<Props extends Record<string, unknown>> {
  bootstrap?: () => void
  firstUpdated?: (
    attributeName: keyof Props,
    propsValue: Props[keyof Props],
    container: Element,
    props: Props
  ) => void
  mount: (container: Element, props: Props) => void
  updated?: (
    attributeName: keyof Props,
    propsValue: Props[keyof Props],
    container: Element,
    props: Props
  ) => void
  unmount?: () => void
}
```

## 2. Register the module

Use `magic(name, module, options)` to register the module as a browser-native Custom Element.

```javascript
import magic from '@magic-microservices/magic'
import UserCard from './UserCard'

magic('user-card', UserCard)
```

## 3. Use the module

Once registered, the module can be consumed like any other HTML element.

```html
<user-card user-id="42"></user-card>
```

```jsx
<user-card user-id="42"></user-card>
```

## Why this model stays light

Compared with solutions that orchestrate full-page applications, Magic leans toward service-oriented modules:

- smaller delivery boundaries
- lower adoption cost
- more direct browser runtime behavior
- a unified consumption contract based on HTML tags

## Design principles behind the model

- **Web Components Plus**: preserve the native Custom Element contract and extend data passing without abandoning browser standards
- **Thin bridge**: keep Core focused on the minimal runtime loop instead of baking orchestration into the foundation
- **Modules as units**: let widgets, business panels, and remote modules all become valid delivery units
- **Framework flattening**: let authors keep their preferred stack while consumers integrate through the same HTML contract

If you want the deeper rationale, continue with [Design Philosophy](./design-philosophy).

## Good use cases

- gradually introducing a new framework into a legacy project
- letting teams evolve modules independently
- publishing frontend capabilities as reusable tags
- sharing the same UI capability across multiple host systems
