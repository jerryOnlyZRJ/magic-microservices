# Module Registration

The goal of registration is simple: turn your business module into a custom element that HTML can consume directly.

## Local modules

If the module already exists inside your project, import and register it:

```javascript
import magic from '@magic-microservices/magic'
import MyModule from './MyModule'

magic('custom-component', MyModule)
```

## Remote UMD modules

If the module is deployed remotely as UMD and exposed on `window`, you can register it directly:

```html
<script src="https://somewhere/to/your/module/index.umd.js"></script>
<script>
  magic('custom-component', window.MyModule)
</script>
```

## Remote ES Modules

```html
<script type="module">
  import MyModule from 'https://somewhere/to/your/module/index.esm.js'
  magic('custom-component', MyModule)
</script>
```

## SystemJS

If your module is published through SystemJS, you can load it as a remote module:

```javascript
magic('custom-component', System.import('https://somewhere/to/your/module/index.system.js'))
```

SystemJS is a practical option when you need remote delivery, compatibility, and smoother module loading.

## How consumers use it

Once the module is registered, consumers can use the same element everywhere:

```html
<custom-component id="42" test></custom-component>
```

```jsx
<custom-component id="42" test></custom-component>
```

That is one of Magic's core benefits: no matter where the module comes from or which framework created it, the final delivery contract is still a native HTML tag.
