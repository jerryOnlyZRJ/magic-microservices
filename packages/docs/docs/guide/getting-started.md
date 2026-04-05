# 快速开始

Magic Microservices 的目标是把微前端降维成一个浏览器原生可识别的 Custom Element。你只需要完成三件事：引入运行时、注册模块、在页面里使用它。

## 安装

### 通过 NPM 安装

```bash
npm i @magic-microservices/magic
```

```javascript
import magic, { useProps } from '@magic-microservices/magic'
```

### 通过 `<script>` 直接引入

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
```

现代浏览器也可以直接使用 ES Module：

```html
<script type="module">
  import magic, { useProps } from 'https://unpkg.com/@magic-microservices/magic@latest/dist/index.esm.browser.js'
</script>
```

## 第一个微应用

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
<script>
  magic('custom-component', {
    mount: (container) => {
      container.innerHTML = 'Hello magic!'
    },
  })
</script>

<custom-component></custom-component>
```

上面这段代码完成了三件事：

- 通过 UMD 方式把 Magic runtime 暴露到浏览器环境
- 调用 `magic()` 把一个模块注册为自定义元素
- 直接使用 `<custom-component>` 渲染微应用

## 与应用级编排的关系

如果你熟悉 single-spa 一类解决方案，可以把 Magic 理解成一个更轻量的模块注册层：

- single-spa 更擅长应用级组合、路由切换与多应用编排
- Magic 更适合组件级或模块级接入，把能力直接映射成 Custom Element
- 两者都强调框架自由，但 Magic 更贴近浏览器原生标准

## 下一步

- 阅读 [核心概念](./core-concepts) 了解 Magic Module 的整体模型
- 阅读 [生命周期](./lifecycle) 理解模块在挂载、更新、卸载过程中的职责
- 阅读 [Props 与数据传递](./props) 学习如何传递复杂数据
