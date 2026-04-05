# useProps()

`useProps()` 用于在脚本环境中传递引用类型数据，例如函数、对象和数组。

## 为什么需要它

Custom Element 的 attribute 只能天然表达字符串，而前端微应用经常需要接收回调函数、配置对象或数据数组。`useProps()` 让这些引用值能够稳定传递给 Magic 模块。

## 示例

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

## 适用场景

- 传递对象配置
- 传递数组数据源
- 传递事件回调
- 传递宿主环境中的共享引用

## 最佳实践

- 原始类型优先直接通过 attribute 传值
- 引用类型再使用 `useProps()`
- 配合 `propTypes` 明确声明输入边界
- 在 `updated` 生命周期中处理引用变化后的刷新逻辑
