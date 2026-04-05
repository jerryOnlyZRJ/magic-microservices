# 模块注册

Magic 的注册目标很简单：把你的业务模块变成一个可以被 HTML 直接消费的自定义元素。

## 本地模块

如果模块已经存在于你的工程中，直接通过 `import` 引入并注册即可。

```javascript
import magic from '@magic-microservices/magic'
import MyModule from './MyModule'

magic('custom-component', MyModule)
```

## 远端 UMD 模块

如果模块已经以 UMD 形式部署在远端，并挂载到 `window` 上，也可以直接注册：

```html
<script src="https://somewhere/to/your/module/index.umd.js"></script>
<script>
  magic('custom-component', window.MyModule)
</script>
```

## 远端 ES Module

```html
<script type="module">
  import MyModule from 'https://somewhere/to/your/module/index.esm.js'
  magic('custom-component', MyModule)
</script>
```

## SystemJS

如果你的模块通过 SystemJS 发布，可以直接按远端模块加载：

```javascript
magic('custom-component', System.import('https://somewhere/to/your/module/index.system.js'))
```

对于需要兼顾远端发布、兼容性与模块化加载体验的团队，SystemJS 是一个很实用的选择。

## 注册后的消费方式

一旦注册完成，业务方就可以用统一方式消费模块：

```html
<custom-component id="42" test></custom-component>
```

```jsx
<custom-component id="42" test></custom-component>
```

这也是 Magic 的关键价值：不管模块从哪里来、用什么框架写，最终交付协议都统一为浏览器原生标签。
