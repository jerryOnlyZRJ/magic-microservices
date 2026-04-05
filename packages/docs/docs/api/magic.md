# magic()

`magic()` 用于把一个符合生命周期约定的模块注册为 Custom Element。

## 签名

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

## 参数

### name

自定义元素名称。建议使用带连字符的命名方式，例如 `user-card`、`marketing-banner`。

### module

符合 Magic 生命周期约定的模块对象，也可以传入异步加载后的模块。

### options

#### propTypes

声明属性名及属性类型，让 Magic 能正确观察属性变化并完成类型转换。

#### styles

需要注入到 Shadow DOM 中的外部 CSS 资源地址列表。

#### scripts

在模块挂载前需要预先加载的外部脚本资源列表。

## 示例

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

## 使用建议

- `name` 保持稳定，避免与已有元素冲突
- `propTypes` 只声明真实需要观察的属性
- 外部资源尽量保持幂等，避免重复副作用
