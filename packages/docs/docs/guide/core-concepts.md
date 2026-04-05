# 核心概念

Magic 把微前端能力收敛成一个清晰的三段式模型：改造模块、注册模块、使用模块。

## 1. 改造模块

你的业务代码本身可以来自 React、Vue、原生 JS 或任何能操作 DOM 的实现。为了让它被 Magic 驱动，只需要暴露符合约定的生命周期函数。

```typescript
interface Module<Props extends Record<string, unknown>> {
  bootstrap?: () => void
  firstUpdated?: (
    attributeName: keyof Props,
    propsValue: Props[keyof Props],
    container: Element,
    props: Props
  ) => void
  mount: (container: Element, props: Props) => void
  updated?: (
    attributeName: keyof Props,
    propsValue: Props[keyof Props],
    container: Element,
    props: Props
  ) => void
  unmount?: () => void
}
```

## 2. 注册模块

通过 `magic(name, module, options)`，模块会被注册成浏览器原生支持的 Custom Element。注册完成后，它的消费方式就和普通 HTML 标签一致。

```javascript
import magic from '@magic-microservices/magic'
import UserCard from './UserCard'

magic('user-card', UserCard)
```

## 3. 使用模块

注册完成后，你可以在任意页面或任意框架里直接使用这个元素。

```html
<user-card user-id="42"></user-card>
```

```jsx
<user-card user-id="42"></user-card>
```

## 为什么这个模型更轻

与需要把整页应用纳入统一编排的微前端方案相比，Magic 的重心更偏向“模块服务化”：

- 交付边界更小，模块可以按组件粒度拆分
- 接入门槛更低，不需要先引入完整的主子应用协议
- 运行时更直接，浏览器本身就是宿主环境
- 多框架共存更自然，最终消费协议统一为 HTML 标签

## 适合的场景

- 在老项目中逐步引入新框架能力
- 让团队以组件或业务模块为单位独立演进
- 将服务化前端模块发布为标准化标签
- 在多个宿主系统之间复用同一套前端能力
