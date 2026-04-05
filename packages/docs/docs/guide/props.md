# Props 与数据传递

Magic 基于 Web Components，而 Web Components 的 attribute 本质上是字符串。为了让微应用之间稳定传值，Magic 提供了 `propTypes` 和 `useProps()` 两套能力。

## propTypes

只有在 `propTypes` 中显式声明过的属性，才会被正确转换并触发属性更新逻辑。

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

支持的类型如下：

```typescript
type PropTypes =
  | typeof Number
  | typeof Boolean
  | typeof String
  | typeof Array
  | typeof Function
  | typeof Object
```

## 为什么要显式声明

这是浏览器 Custom Elements 生命周期约束决定的：

- 没有声明的属性不会进入属性观察流程
- 属性变化不会触发 `attributeChangedCallback`
- 模块将无法感知上层传入值的更新

## useProps()

当你需要传递函数、对象、数组等引用类型数据时，可以使用 `useProps()` 包装它们。

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

## 建议

- 原始值优先通过普通 attribute 传递
- 引用类型再使用 `useProps()` 包装
- 让 `propTypes` 与真实输入保持一致，避免隐式转换问题
- 在 `updated` 生命周期中统一处理属性更新带来的副作用
