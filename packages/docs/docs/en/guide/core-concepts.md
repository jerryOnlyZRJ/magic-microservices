# Core Concepts

Magic reduces micro frontend delivery to a clear three-part model: transform a module, register it, and use it.

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

## Good use cases

- gradually introducing a new framework into a legacy project
- letting teams evolve modules independently
- publishing frontend capabilities as reusable tags
- sharing the same UI capability across multiple host systems
