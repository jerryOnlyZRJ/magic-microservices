# magic()

`magic()` registers a lifecycle-aware module as a Custom Element.

## Signature

```typescript
magic(
  name: string,
  module: Module<Record<string, unknown>> | Promise<Module<Record<string, unknown>>>,
  options?: {
    propTypes?: Record<string, typeof Number | typeof Boolean | typeof String | typeof Array | typeof Function | typeof Object>
    styles?: string[]
    scripts?: string[]
  }
): void
```

## Parameters

### name

The custom element name. Use names with a hyphen such as `user-card` or `marketing-banner`.

### module

A module object that follows the Magic lifecycle contract, or an asynchronously loaded module.

### options

#### propTypes

Declares the attribute names and their types so Magic can observe changes and convert values correctly.

#### styles

A list of external CSS resources to inject into Shadow DOM.

#### scripts

A list of external script resources to preload before the module mounts.

## Example

```javascript
import magic from '@magic-microservices/magic'
import UserCard from './UserCard'

magic('user-card', UserCard, {
  propTypes: {
    id: Number,
    title: String,
    callback: Function,
  },
  styles: ['https://cdn.example.com/user-card.css'],
  scripts: ['https://cdn.example.com/runtime.js'],
})
```

## Recommendations

- keep `name` stable and avoid collisions
- declare only the attributes you really observe
- make external resources idempotent to avoid repeated side effects
