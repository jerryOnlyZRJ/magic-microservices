<p align="center">
    <img width="300" src="https://lf3-static.bytednsdoc.com/obj/eden-cn/lpqulynulog/magic/logo.qW4rU0mH6aL8.svg">
</p>

<h1 align="center">Magic Microservices</h1>

<div align="center">

让前端的一切皆可“微”（一个函数解决微前端）

[![Build Status](https://www.travis-ci.org/bytedance/magic-microservices.svg?branch=main)](https://www.travis-ci.org/bytedance/magic-microservices) [![codecov](https://codecov.io/gh/bytedance/magic-microservices/branch/main/graph/badge.svg?token=FmpE8fWxEu)](https://codecov.io/gh/bytedance/magic-microservices) [![npm](https://img.shields.io/npm/v/@magic-microservices/magic)](https://www.npmjs.com/package/@magic-microservices/magic) [![GitHub](https://img.shields.io/github/license/bytedance/magic-microservices?color=blue)](https://github.com/bytedance/magic-microservices/blob/main/LICENSE)

[English](./README.md) | 简体中文

</div>

## 维护状态

这个 fork 是 [bytedance/magic-microservices](https://github.com/bytedance/magic-microservices)
的持续维护版本。上游仓库因为公司侧治理原因，直接更新和发版受到限制并已归档；本仓库会继续承接缺陷修复、安全维护、文档更新和迁移指引。

非安全问题请通过本仓库的 GitHub Issues 提交。涉及漏洞、利用细节或其他敏感安全信息时，请按照 [SECURITY.md](./SECURITY.md) 的流程私下报告，不要创建公开 issue。

活跃维护者和维护职责记录在 [MAINTAINERS.md](./MAINTAINERS.md)。当前安全审计和迁移路线图通过 [issue #1](https://github.com/jerryOnlyZRJ/magic-microservices/issues/1) 跟踪。

## 概述

一款基于 Web Components 的轻量级的微前端工厂函数。

## 优势

- ⚡ 轻 / Small bundle size (ESM Browser: 2.4KB；ESM/CJS：3.7KB；UMD：3.7KB)
- 🚀 抹平框架 / Writes and works with all frameworks.
- 🔨 灵活包装 / An adapter for any JS module, friendly to existing code.
- 💪 Web Components Plus / Empower native Web Components

## 快速上手

1. 引入工具函数

```html
<html>
  <body>
    <script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
  </body>
</html>
```

2. 注册你的第一个微应用

```html
<html>
  <body>
    <script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
    <script>
      magic('custom-component', {
        mount: (container) => (container.innerHTML = 'Hello magic!'),
      });
    </script>
  </body>
</html>
```

3. 使用你注册好的微应用并验证一下吧

```html
<html>
  <body>
    <custom-component></custom-component>
    <script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
    <script>
      magic('custom-component', {
        mount: (container) => (container.innerHTML = 'Hello magic!'),
      });
    </script>
  </body>
</html>
```

## 引入工具函数

### 兼容性

Magic Microservices 使用了 Web Components 的相关特性作为核心能力支持，所以 Magic 的兼容性是与 Web Components 的部分特性是一致的。

#### 兼容性一览

> from [caniuse.com](http://caniuse.com)

- 现代化浏览器（last 2 versions）和 IE11+(需要 [polyfills](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs))
- Web Components([Custom Elements](https://caniuse.com/custom-elementsv1))
- Web Components([Shadow DOM](https://caniuse.com/shadowdomv1)) (当你开启 sandbox 能力的时候你才会用到)

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                           |

如果你需要支持低版本 IE11 以及一些老版本的浏览器，magic 可能不是你的最佳选择。虽然你能够通过一些 polyfill 来实现一些老版本浏览器对于 Web Components 的相关特性的基础支持，但不免也会存在一些不可控的风险。

### 直接使用 `<script>` 标签引入

#### UMD 方式

我们封装了 umd 包，可以直接在 html 中引入：

```html
<script src="https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.js"></script>
```

在 window 上就拥有了 magic 以及 magic.useProps 方法了，你可以可以配合 externals 等机制使用 Magic

当然我们也提供了压缩后的包，如果是在**生产模式**下，可以拉取我们压缩后的工具包：`https://unpkg.com/@magic-microservices/magic@latest/dist/index.umd.min.js`

#### ES Module 方式

对于一些现代浏览器，也可以直接使用 ES Module 方式引入核心逻辑：

```html
<script type="module">
  import magic, { useProps } from 'https://unpkg.com/@magic-microservices/magic@latest/dist/index.esm.browser.js';
</script>
```

就可以直接使用我们的相关方法了

**PS：如果使用 ES Module 的方式你可能需要更加关注兼容性：https://caniuse.com/es6-module**

### NPM 安装方式

如果你想要让 magic 跟随你的项目构建一块完成以实现一些深度的 tree-shaking 能力，也可以直接安装我们的 NPM 包：

```shell
# 最新稳定版
$ npm i @magic-microservices/magic
```

就可以使用我们的相关方法了：

```javascript
import magic, { useProps } from '@magic-microservices/magic';
```

## 封装你自己的微应用

### 改造

> 将你的 JS Module 改造成一个 “Magic” Module

Magic Module 与普通的 JS Module 的差别就是你需要 export 特定的函数，以对 Module 的渲染、更新或者卸载等流程作出所需的响应，并且，这些函数需要符合 Magic 生命周期的定义。

#### Module 生命周期

每一个被注册成为微应用的 Magic module 都会像原生 HTML 元素一样经历渲染、更新以及卸载等过程，因为它最终的形态本质上就是一个原生的 HTML 标签。所以你可以在这些过程中，自由定义你想要的逻辑以及处理流程。

##### 生命周期类型定义

每一个 Magic Module 都需要符合 magic 生命周期的规范定义，你可以参考 magic module 的类型声明文件，在合适的时机执行你的定制化逻辑：

```typescript
type ValueOf<T> = T[keyof T];

interface Module<Props extends Record<string, unknown>> {
  // 你可以在这里执行一些微应用挂在到 DOM 之前需要的逻辑
  bootstrap?: () => void;
  // 微应用挂载到 DOM 上之前，props 上的每一个字段初始化都将会触发的回调
  firstUpdated?: (attributeName: keyof Props, propsValue: ValueOf<Props>, container: Element, props: Props) => void;
  // 你可以在这里执行你的渲染逻辑，比如： ReactDOM.render(<App />, container)
  // 这里会给到你 render 时需要的 DOM 节点以及从上层传递过来的 props
  mount: (container: Element, props: Props) => void;
  // 微应用挂载到 DOM 上之后，props 上每一个字段的每次更新都会触发的回调
  updated?: (attributeName: keyof Props, propsValue: ValueOf<Props>, container: Element, props: Props) => void;
  // 在微应用即将从 DOM 树上卸载时，你可以清除一些副作用
  unmount?: () => void;
}
```

##### 生命周期图示

下方的流程图就表述了 magic 在各个阶段触发 module 生命周期的过程，通过下图你或许就能了解到更多关于一个 module 在被最终挂载到 DOM 上之前以及后来的更新、卸载流程中，它所经历的详细过程：

![lifecycle diagram](https://sf1-dycdn-tos.pstatp.com/obj/eden-cn/lpqulynulog/magic/module-lifecycle.png)

#### 代码示例

Talk is cheap, show me your code. 当然没有什么比实际的代码来得再形象不过了，我们选择了业内比较热门的两个前端框架：React 和 Vue(3)，为大家提供了两个如果在现有框架之上快速封装一个 Magic module 的示例。

##### React：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import List from './component/List.jsx';

const dataList = [{ name: 'hello' }, { name: 'world' }, { name: 'react' }, { name: 'react-dom' }];

export async function bootstrap() {
  console.log('magic-microservices-component bootstraped');
}

export async function mount(container, props) {
  console.log('magic-microservices-component mount >>> ', props);
  ReactDOM.render(React.createElement(List, { ...props, dataList }, null), container);
}

export async function updated(attrName, value, container, props) {
  console.log('magic-microservices-component update >>> ', props);
  ReactDOM.render(React.createElement(List, { ...props, dataList }, null), container);
}

export async function unmount() {
  console.log('magic-microservices-component will unmount');
}
```

##### Vue(3)：

```javascript
import Vue from 'vue/index';
import App from './component/Hello.vue';

let vueInstance = null;

export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(container, props) {
  console.log('magic-microservices-component-vue mount >>> ', props);
  vueInstance = Vue.createApp({
    ...App,
    data() {
      return props;
    },
  }).mount(container);
}

export async function updated(attrName, value) {
  console.log('magic-microservices-component-vue update', attrName, ' >>> ', value);
  vueInstance[attrName] = value;
  vueInstance.$forceUpdate();
}

export async function unmount() {
  console.log('vue app will unmount');
}
```

### 注册

> 将你的 Magic Module 注册成为一个 HTML 标签原生支持的“微应用”

#### 微应用拉包

##### 本地 NPM 包或开发模块

可以直接在你的项目逻辑里通过 `import` 的方式引入 magic 以及符合 magic 生命周期规范的 module，将 module 作为 magic 的第二个参数传入进行包裹即可，示例代码：

```javascript
import magic from '@magic-microservices/magic';
import MyModule from '/path/to/your/module';

magic('custom-component', MyModule);
```

##### 远端包(UMD)

如果你的 Module 已经通过 UMD 等方式部署在远端，则可以直接对你的 Module 进行包裹
通过 scripts 等方式引入你的远端 UMD Module：

```html
<script src="https://somewhere/to/your/module/index.umd.js"></script>
```

如果你的 Module 已经被挂在了 window 上，那你就可以直接使用 magic 包裹了

```javascript
magic('custom-component', window.MyModule);
```

##### 远端包(ES Module)

当然，与 UMD 同理，你也可以直接使用你发布的 ES Module 远端包：

```html
<script type="module">
  import MyModule from 'https://somewhere/to/your/module/index.esm.js';
  magic('custom-component', MyModule);
</script>
```

##### SystemJS(推荐)

如果你是使用 [SystemJS](https://github.com/systemjs/systemjs) 注册的包，那一切就变得很简单了，直接通过 System 引入即可：

```javascript
magic('custom-component', System.import('https://somewhere/to/your/module/index.system.js'));
```

> PS：SystemJS 的优势
>
> - System 既能够加载远端包，又能够实现本地包的加载
> - 比起 CJS，它不需要 npm install
> - 比起 UMD，它不需要关注 window 上的全局变量
> - 比起 ESM，它不需要关心兼容性问题

你的 module 最后可以被构建成任何模块化形式，比如 NPM 包、ES Module 包、UMD 包或者 SystemJS 包等等，只要它在注册时能够通过 npm install 或者服务化组件的形式被获取到就可以了

**我们推荐使用 SystemJS 作为你的模块化第一选择，因为这套方案对于服务化组件的引包体验以及兼容性都比起现有的一些模块化实现更加友好**

#### Props 声明

如果你需要主从应用之间的数据传递能力，你就需要用到 magic 的 Props 能力。微应用的 Props 需要通过 magic 的第三个参数的 propTypes 属性显式声明参数及参数类型（[Web Components 规范](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks) 约束），否则无法实现 Props 透传以及 Props 变更变更事件监听，示例代码：

```javascript
magic('my-component', MyModule, {
  propTypes: {
    id: Number,
    test: Boolean,
    callback: Function,
    count: Number,
  },
});
```

propTypes 的类型 PropTypesMap 的定义如下所示：

```typescript
type PropTypes = typeof Number | typeof Boolean | typeof String | typeof Array | typeof Function | typeof Object;

interface PropTypesMap {
  [propsName: string]: PropTypes;
}
```

- key：props 的名称
- value：props 的类型（使用 JS 原生的类型构造函数即可，例如：Number）

##### 引用类型数据的特殊处理

了解过 Web Components 的同学肯定都知道，因为 Web Components 是 **HTML** 规范，因此我们生成的自定义 Component（Custom Element）**只能支持字符串进行传参**。
Magic 对 Web Components 的传参能力实现了赋能：如果你想要在脚本语言中使用引用类型的数据并希望能通过 Web Components 传递，**在使用注册好的微应用时，可以使用 `useProps` 方法对引用类型的数据进行包裹**。当然，你包裹非引用类型的数据也是没有问题的，不过，propTypes 会一同帮你做掉类型转换的事情，因此，**我们建议严格区分引用类型和非引用类型的数据，这样对浏览器的内存管理更加友好，因此，不要使用 useProps 包裹非引用类型的数据**。示例代码：

```javascript
//注册
import magic from '@magic-microservices/magic';

const MyModule = {
  mount: (container, props) => {
    console.log('props >>> ', props);
  },
};

magic('my-application', MyModule, {
  propTypes: {
    id: Number,
    test: Boolean,
    callback: Function,
  },
});

// 使用
import { useProps } from '@magic-microservices/magic';

ReactDOM.render(
  <my-application
    id="2"
    test
    callback={useProps(function () {
      return 'test';
    })}
  ></my-application>,
  MOUNT_NODE,
);
```

最终在 mount 中的输出也是符合我们的预期，id 是 Number 类型的数据，test 是 Boolean 类型的数据，以及 callback 也是与 useProps 包裹的引用类型数据地址完全相同的引用数据：

![props output](https://sf1-dycdn-tos.pstatp.com/obj/eden-cn/lpqulynulog/magic/props-output.png)

### 使用

> 通过 HTML 标签的形式直接使用你的“微应用”

注册完的 magic 微应用，就可以直接通过 HTML 标签的形式使用你的微应用啦

比如在 HTML 里：

```html
<custom-component id="2" test></custom-component>
```

或者在各大框架的 JS 逻辑里（以 React 为例）：

```javascript
ReactDOM.render(
  <custom-component id="123" test count={count} callback={useProps(() => 'test')}></custom-component>,
  MOUNT_NODE,
);
```
