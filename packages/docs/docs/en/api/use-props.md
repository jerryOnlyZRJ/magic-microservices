# useProps()

`useProps()` is used to pass reference values in script environments, such as functions, objects, and arrays.

## Why it exists

Custom Element attributes only express strings naturally, but micro applications often need callbacks, config objects, or array data. `useProps()` lets those references flow into Magic modules safely.

## Example

```jsx
import ReactDOM from 'react-dom'
import { useProps } from '@magic-microservices/magic'

ReactDOM.render(
  <user-card
    id="42"
    profile={useProps({ name: 'Magic', role: 'admin' })}
    onSelect={useProps((record) => record.id)}
    dataSource={useProps([{ id: 1 }, { id: 2 }])}
  ></user-card>,
  document.getElementById('root')
)
```

## Good use cases

- passing object configs
- passing array data sources
- passing event callbacks
- passing shared references from the host environment

## Best practices

- prefer plain attributes for primitive values
- use `useProps()` for reference values only
- combine it with `propTypes` to keep input boundaries explicit
- handle refresh logic in the `updated` lifecycle
