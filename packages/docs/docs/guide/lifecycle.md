# 生命周期

Magic Module 会像原生 HTML 元素一样，经历初始化、挂载、更新与卸载过程。你只需要在正确的生命周期里写入对应逻辑。

## 生命周期接口

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

## 各阶段职责

### bootstrap

适合做渲染前的准备工作，例如初始化国际化资源、预热缓存或注册全局能力。

### firstUpdated

在模块挂载前，DOM attributes 初始化到 props 时会逐个触发。这个阶段适合做初始属性转换后的副作用处理。

### mount

真正的渲染入口。你会拿到容器节点和 props，并把你的应用挂载进去。

### updated

当已声明的属性发生变化时触发。这个阶段适合同步派生状态、重渲染 UI 或处理属性驱动的更新逻辑。

### unmount

模块从 DOM 树中移除前触发。这里通常用于清理计时器、请求、订阅和事件监听器。

## React 示例

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

## 设计建议

- 把初始化放进 `bootstrap`，避免每次挂载都重复执行
- 把 UI 渲染集中在 `mount` 和 `updated`
- 把资源回收统一放进 `unmount`
- 让生命周期职责单一，便于调试模块行为
