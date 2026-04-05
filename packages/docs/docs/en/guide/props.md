# Props & Data Flow

Magic is built on Web Components, and Web Component attributes are string-based by nature. To support stable data transfer between host and micro app, Magic provides `propTypes` and `useProps()`.

## propTypes

Only attributes declared in `propTypes` are converted correctly and observed for updates.

```javascript
magic('my-component', MyModule, {
  propTypes: {
    id: Number,
    test: Boolean,
    title: String,
    callback: Function,
    dataSource: Object,
  },
})
```

Supported types:

```typescript
type PropTypes =
  | typeof Number
  | typeof Boolean
  | typeof String
  | typeof Array
  | typeof Function
  | typeof Object
```

## Why explicit declaration matters

This behavior follows Custom Elements constraints:

- undeclared attributes do not enter the observation flow
- changes do not trigger `attributeChangedCallback`
- your module cannot react to host-side updates

## useProps()

Use `useProps()` when you need to pass reference values such as functions, objects, and arrays.

```jsx
import ReactDOM from 'react-dom'
import { useProps } from '@magic-microservices/magic'

ReactDOM.render(
  <my-application
    id="2"
    test
    callback={useProps(() => 'test')}
    dataSource={useProps([{ id: 1, name: 'magic' }])}
  ></my-application>,
  document.getElementById('root')
)
```

## Recommendations

- use plain attributes for primitive values first
- use `useProps()` only for reference values
- keep `propTypes` aligned with real inputs
- handle update-driven side effects in the `updated` lifecycle
