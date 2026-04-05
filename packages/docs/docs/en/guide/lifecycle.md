# Lifecycle

Magic Modules go through initialization, mounting, updates, and unmounting just like native HTML elements. Each lifecycle hook has a focused responsibility.

## Lifecycle interface

```typescript
type ValueOf<T> = T[keyof T]

interface Module<Props extends Record<string, unknown>> {
  bootstrap?: () => void
  firstUpdated?: (
    attributeName: keyof Props,
    propsValue: ValueOf<Props>,
    container: Element,
    props: Props
  ) => void
  mount: (container: Element, props: Props) => void
  updated?: (
    attributeName: keyof Props,
    propsValue: ValueOf<Props>,
    container: Element,
    props: Props
  ) => void
  unmount?: () => void
}
```

## Stage responsibilities

### bootstrap

Run work before rendering, such as initializing i18n resources, warming caches, or registering shared capabilities.

### firstUpdated

This hook runs while DOM attributes are being initialized into props, before the module mounts. It is useful for side effects based on initial attribute values.

### mount

This is the main render entry. You receive the container element and props, then render your application into that container.

### updated

This hook runs when declared attributes change. It is the right place to refresh derived state, rerender UI, or react to prop-driven changes.

### unmount

This hook runs before the module leaves the DOM tree. Use it to clean up timers, requests, subscriptions, and event listeners.

## React example

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

export async function mount(container, props) {
  ReactDOM.render(React.createElement(App, props), container)
}

export async function updated(attrName, value, container, props) {
  ReactDOM.render(React.createElement(App, props), container)
}

export async function unmount() {
  console.log('clean up side effects here')
}
```

## Design tips

- keep one-time preparation in `bootstrap`
- keep rendering in `mount` and `updated`
- keep cleanup in `unmount`
- keep lifecycle boundaries explicit so module behavior is easy to debug
