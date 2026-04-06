# 核心概念

Magic 把微前端能力收敛成一个清晰的三段式模型：改造模块、注册模块、使用模块。这个模型背后对应的是一套更底层的设计判断：**把模块交付压回浏览器原生能力，把框架差异收敛成统一标签协议，把复杂扩展留给上层生态。**

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

与需要把整页应用纳入统一编排的微前端方案相比，Magic 的重心更偏向模块服务化：

- 交付边界更小，模块可以按组件粒度拆分
- 接入门槛更低，不需要先引入完整的主子应用协议
- 运行时更直接，浏览器本身就是宿主环境
- 多框架共存更自然，最终消费协议统一为 HTML 标签

## 这套模型背后的设计原则

- **Web Components Plus**：不是替代浏览器标准，而是在保留 Custom Element 交付方式的前提下增强数据透传能力
- **薄桥接层**：Core 只做最小运行时闭环，不把应用级编排强耦合进底层
- **模块即实体**：微前端粒度不受整页应用限制，组件和业务模块都可以成为独立单元
- **抹平框架**：开发者可以保留现有技术栈，消费方只需要理解统一的 HTML 标签协议

如果你想进一步理解这些判断为什么成立，可以继续阅读 [设计理念](./design-philosophy)。

## 适合的场景

- 在老项目中逐步引入新框架能力
- 让团队以组件或业务模块为单位独立演进
- 将服务化前端模块发布为标准化标签
- 在多个宿主系统之间复用同一套前端能力
