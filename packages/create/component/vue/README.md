# magic-microservices-component-vue

**A simple magic microservice component.**

* Works with all frameworks 🧩
* Works with CDNs 🚛
* Customizable CSS Shadow 🎨
* Open source 😸

Power by **Magic MicroService**.

## Quick Start

Add the following code to your page.

```html
<script src="https://unpkg.bytedance.net/@byted-cg/magic-microservice/latest/dist/index.umd.min.js"></script>
<script type="module">
  import * as MyComponent from 'https://unpkg.bytedance.net/@magic-microservices/component-vue/latest/dist/index.esm.browser.js';
  magic('my-component', MyComponent, {
    styles: ['https://unpkg.bytedance.net/@magic-microservices/component-vue/latest/dist/index.min.css'],
  });
</script>
```

Now you have access to the magic component! You can use it in any framework（React、Vue、HTML...） via an HTML tag like:

```html
<my-component></my-component>
```

## Registration

You can register this component via both CDN and NPM packages.

#### At first

You should ensure that the magic-microservice has been installed in your project. If not, you can add it by [these steps](https://bytedance.feishu.cn/docs/doccnFfVfMziGTBK4hrFKqAYIyp#brR1yi).

### CDN

The easiest way to get this component is with the CDN. There are three normal ways:

#### SystemJS

```javascript
magic('my-component', System.import('https://unpkg.bytedance.net/@magic-microservices/component-vue/latest/dist/index.system.min.js'))
```

#### ES Module

```html
<script type="module">
import MyModule from 'https://unpkg.bytedance.net/@magic-microservices/component-vue/latest/dist/index.esm.browser.min.js'
magic('my-component', MyModule)
</script>
```

#### UMD

Import the UMD bundle at first:

```html
<script src="https://unpkg.bytedance.net/@magic-microservices/component-vue/latest/dist/index.umd.min.js"></script>
```

Now this component will be added in the window with a camelcase name：

```js
magic('my-component', window.MagicQuillComponent)
```

### NPM Package

If you don't want to use the CDN, you can install this component locally with the following command.

```shell
$ npm install @magic-microservices/component-vue
```

And then, you can register it anywhere you want:

```js
import * as MagicQuillComponent from @magic-microservices/component-vue
magic('my-component', MagicQuillComponent)
```

## Usage

This component is just regular HTML elements, or "custom elements" to be precise. You can use them like any other HTML element, such as div、span...

### Props

...