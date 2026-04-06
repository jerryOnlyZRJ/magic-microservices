# Getting Started

Magic Microservices turns micro frontend delivery into a browser-native Custom Element workflow. You only need three steps: load the runtime, register a module, and use it in the page.

## Install

### Install with NPM

```bash
npm i @magic-microservices/magic
```

```javascript
import magic, { useProps } from '@magic-microservices/magic'
```

### Load with a `<script>` tag

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
```

For modern browsers, you can also use ES Modules:

```html
<script type="module">
  import magic, { useProps } from 'https://unpkg.com/@magic-microservices/magic@latest/dist/index.esm.browser.js'
</script>
```

## Your first micro app

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
<script>
  magic('custom-component', {
    mount: (container) => {
      container.innerHTML = 'Hello magic!'
    },
  })
</script>

<custom-component></custom-component>
```

This example does three things:

- exposes the Magic runtime in the browser
- registers a module with `magic()`
- renders the result with a native custom element

## Compared with application orchestration

If you already know single-spa style solutions, you can think of Magic as a smaller registration layer:

- single-spa is strong at app-level orchestration, routing, and composition
- Magic is strong at module-level adoption with Custom Elements as the delivery contract
- both keep framework freedom, but Magic stays closer to browser-native primitives

## Next steps

- Read [Core Concepts](./core-concepts) to understand the overall model
- Read [Design Philosophy](./design-philosophy) to understand why Magic stays browser-native and intentionally thin
- Read [Core Capabilities](./core-capabilities) to try the minimal runtime loop with live demos
- Read [Lifecycle](./lifecycle) to learn each lifecycle stage
- Read [Props & Data Flow](./props) to pass complex data safely
