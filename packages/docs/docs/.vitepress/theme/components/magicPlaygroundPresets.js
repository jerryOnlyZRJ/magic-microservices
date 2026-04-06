export const magicPlaygroundPresets = {
  "hello-card": {
    title: "Hello Card",
    description: {
      zh: "体验最小的模块注册闭环：注册、挂载、更新，再通过 HTML 标签直接消费。",
      en: "Try the smallest registration loop: register, mount, update, and consume a module through a native HTML tag.",
    },
    html: `<hello-card title="Magic" message="Edit me in the panel."></hello-card>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.demo-card {
  padding: 20px;
  border: 1px solid rgba(91, 108, 255, 0.2);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(91, 108, 255, 0.16), rgba(255, 255, 255, 0.96));
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.demo-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.demo-card p {
  margin: 0;
  color: #334155;
}`,
    js: `magic(
  "hello-card",
  {
    mount(container, props) {
      container.innerHTML = \`
        <section class="demo-card">
          <h2>\${props.title}</h2>
          <p>\${props.message}</p>
        </section>
      \`;
    },
    updated(attributeName, value, container, props) {
      this.mount(container, props);
    },
  },
  {
    propTypes: {
      title: String,
      message: String,
    },
  }
);`,
  },
  "use-props-callback": {
    title: "useProps Callback",
    description: {
      zh: "体验 Magic 对引用类型数据的增强：通过 useProps 传递函数引用，而不是把数据退化成字符串。",
      en: "Experience Magic's support for reference values by passing a function with useProps instead of degrading it into a string.",
    },
    html: `<div id="playground-mount"></div>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.callback-card {
  padding: 20px;
  border: 1px solid rgba(91, 108, 255, 0.18);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.callback-card h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.callback-card p {
  margin: 0 0 16px;
  color: #475569;
}

.callback-card button {
  border: 0;
  border-radius: 999px;
  background: #5b6cff;
  color: #ffffff;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.callback-card .result {
  margin-top: 16px;
  color: #1e293b;
  font-family: "SFMono-Regular", Consolas, monospace;
}`,
    js: `function renderCallbackCard(container, props) {
  container.innerHTML = \`
    <section class="callback-card">
      <h2>\${props.title}</h2>
      <p>count = \${props.count}</p>
      <button id="invoke-callback">Run callback</button>
      <div class="result" id="callback-result">Waiting for callback...</div>
    </section>
  \`;

  container.querySelector("#invoke-callback").onclick = () => {
    const result = props.onPing ? props.onPing(props.count) : "No callback provided";
    container.querySelector("#callback-result").textContent = result;
  };
}

magic(
  "callback-panel",
  {
    mount(container, props) {
      renderCallbackCard(container, props);
    },
    updated(attributeName, value, container, props) {
      renderCallbackCard(container, props);
    },
  },
  {
    propTypes: {
      title: String,
      count: Number,
      onPing: Function,
    },
  }
);

const panel = document.createElement("callback-panel");
panel.setAttribute("title", "Magic callback demo");
panel.setAttribute("count", "3");
panel.onPing = magic.useProps((count) => {
  return "callback invoked with count=" + count + " at " + new Date().toLocaleTimeString();
});

document.querySelector("#playground-mount").appendChild(panel);`,
  },
  "module-composition": {
    title: "Module Composition",
    description: {
      zh: "体验模块级组合：多个 Magic 模块可以像原生标签一样协作，而不需要额外的主子应用编排层。",
      en: "Try module-level composition: multiple Magic modules collaborate like native tags without an extra host-child orchestration layer.",
    },
    html: `<section class="composition-layout">
  <user-badge name="Ranjay"></user-badge>
  <status-chip state="ready"></status-chip>
</section>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.composition-layout {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  padding: 14px 18px;
  border-radius: 14px;
  background: #111827;
  color: #ffffff;
  font-weight: 600;
}

.chip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.14);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.18);
  font-weight: 600;
}`,
    js: `magic(
  "user-badge",
  {
    mount(container, props) {
      container.innerHTML = '<span class="badge">@' + props.name + '</span>';
    },
    updated(attributeName, value, container, props) {
      this.mount(container, props);
    },
  },
  {
    propTypes: {
      name: String,
    },
  }
);

magic(
  "status-chip",
  {
    mount(container, props) {
      container.innerHTML = '<span class="chip">system: ' + props.state + '</span>';
    },
    updated(attributeName, value, container, props) {
      this.mount(container, props);
    },
  },
  {
    propTypes: {
      state: String,
    },
  }
);`,
  },
  "adapter-react18": {
    title: "React 18 Adapter",
    description: {
      zh: "使用 @magic-microservices/magic-react 适配 React 18，把 React 组件注册成浏览器原生标签。",
      en: "Use @magic-microservices/magic-react with React 18 to register a React component as a native browser tag.",
    },
    externalScripts: [
      "https://unpkg.com/react@18/umd/react.production.min.js",
      "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
    ],
    html: `<react18-card name="React 18 adapter" message="Edit the component logic and props in the docs."></react18-card>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.framework-card {
  padding: 20px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(59, 130, 246, 0.18);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.framework-pill {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
}

.framework-card h2 {
  margin: 14px 0 8px;
  font-size: 22px;
}

.framework-card p {
  margin: 0;
  color: #475569;
}`,
    js: `const magic = window.magic;
const React = window.React;
const ReactDOM = window.ReactDOM;
const rootMap = new WeakMap();

function magicReact(options) {
  const { React, ReactDOM, component } = options;

  return {
    mount(container, props) {
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(component, props));
      rootMap.set(container, root);
    },
    updated(attributeName, value, container, props) {
      const root = rootMap.get(container);

      if (root) {
        root.render(React.createElement(component, props));
      }
    },
    unmount(instance, container) {
      const root = rootMap.get(container);

      if (root) {
        root.unmount();
        rootMap.delete(container);
      }
    },
  };
}

const ReactCard = (props) => {
  return React.createElement(
    "section",
    { className: "framework-card" },
    React.createElement("span", { className: "framework-pill" }, "React 18"),
    React.createElement("h2", null, props.name),
    React.createElement("p", null, props.message)
  );
};

const reactModule = magicReact({
  React,
  ReactDOM,
  component: ReactCard,
});

magic("react18-card", reactModule, {
  propTypes: {
    name: String,
    message: String,
  },
});`,
  },
  "adapter-react17": {
    title: "React 17 Adapter",
    description: {
      zh: "使用 @magic-microservices/magic-react17 适配 React 17，保持旧版本应用也能接入 Magic。",
      en: "Use @magic-microservices/magic-react17 to keep React 17 applications compatible with Magic.",
    },
    externalScripts: [
      "https://unpkg.com/react@17/umd/react.production.min.js",
      "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    ],
    html: `<react17-card title="React 17 adapter" detail="Legacy apps can still become Custom Elements."></react17-card>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.legacy-card {
  padding: 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(255, 255, 255, 0.98));
  border: 1px solid rgba(14, 165, 233, 0.18);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.legacy-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.legacy-card p {
  margin: 0;
  color: #334155;
}`,
    js: `const magic = window.magic;
const React = window.React;
const ReactDOM = window.ReactDOM;

function magicReact(options) {
  const { React, ReactDOM, component } = options;

  return {
    mount(container, props) {
      ReactDOM.render(React.createElement(component, props), container);
    },
    updated(attributeName, value, container, props) {
      ReactDOM.render(React.createElement(component, props), container);
    },
    unmount(instance, container) {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
}

const React17Card = (props) => {
  return React.createElement(
    "section",
    { className: "legacy-card" },
    React.createElement("h2", null, props.title),
    React.createElement("p", null, props.detail)
  );
};

const react17Module = magicReact({
  React,
  ReactDOM,
  component: React17Card,
});

magic("react17-card", react17Module, {
  propTypes: {
    title: String,
    detail: String,
  },
});`,
  },
  "adapter-preact": {
    title: "Preact Adapter",
    description: {
      zh: "使用 @magic-microservices/magic-preact 适配 Preact，以更轻量的运行时体验 Magic。",
      en: "Use @magic-microservices/magic-preact to try Magic with a lighter Preact runtime.",
    },
    externalScripts: [
      "https://cdn.jsdelivr.net/npm/preact@10.19.6/dist/preact.umd.js",
    ],
    html: `<preact-card framework="Preact adapter" summary="Small runtime, native delivery contract."></preact-card>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.preact-card {
  padding: 20px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(168, 85, 247, 0.18);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.preact-card h2 {
  margin: 0 0 10px;
  color: #7c3aed;
  font-size: 22px;
}

.preact-card p {
  margin: 0;
  color: #475569;
}`,
    js: `const magic = window.magic;
const preact = window.preact;
let vnode = null;

function magicPreact(options) {
  const { preact, component } = options;
  const { h, render, cloneElement } = preact;

  return {
    mount(container, props) {
      vnode = h(component, props, null);
      render(vnode, container);
    },
    updated(attributeName, value, container, props) {
      vnode = cloneElement(vnode, props);
      render(vnode, container);
    },
    unmount(instance, container) {
      vnode = null;
      render(null, container);
    },
  };
}

const PreactCard = (props) => {
  return preact.h(
    "section",
    { class: "preact-card" },
    preact.h("h2", null, props.framework),
    preact.h("p", null, props.summary)
  );
};

const preactModule = magicPreact({
  preact,
  component: PreactCard,
});

magic("preact-card", preactModule, {
  propTypes: {
    framework: String,
    summary: String,
  },
});`,
  },
  "adapter-vue3": {
    title: "Vue 3 Adapter",
    description: {
      zh: "使用 @magic-microservices/magic-vue3 适配 Vue 3，把 Vue 组件映射到统一的 HTML 标签协议。",
      en: "Use @magic-microservices/magic-vue3 to map Vue 3 components onto the same HTML tag contract.",
    },
    externalScripts: ["https://unpkg.com/vue@3/dist/vue.global.prod.js"],
    html: `<vue3-card title="Vue 3 adapter" message="Template syntax stays in Vue, delivery stays in HTML."></vue3-card>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.vue-card {
  padding: 20px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.vue-card h2 {
  margin: 0 0 8px;
  color: #047857;
  font-size: 22px;
}

.vue-card p {
  margin: 0;
  color: #475569;
}`,
    js: `const magic = window.magic;
const VueRuntime = window.Vue;
const appMap = new WeakMap();

function magicVue3(options) {
  const {
    Vue: { createApp, h },
    component,
  } = options;

  return {
    mount(container, props) {
      const app = createApp({
        data() {
          return {
            props,
          };
        },
        render() {
          return h(component, this.props);
        },
      });

      app.mount(container);
      appMap.set(container, app);
    },
    updated(attributeName, value, container, props) {
      const app = appMap.get(container);

      if (app && app._instance && app._instance.data) {
        app._instance.data.props = props;
        app._instance.update();
      }
    },
    unmount(instance, container) {
      const app = appMap.get(container);

      if (app) {
        app.unmount();
        appMap.delete(container);
      }
    },
  };
}

const VueCard = {
  props: ["title", "message"],
  template: \`
    <section class="vue-card">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
    </section>
  \`,
};

const vueModule = magicVue3({
  Vue: VueRuntime,
  component: VueCard,
});

magic("vue3-card", vueModule, {
  propTypes: {
    title: String,
    message: String,
  },
});`,
  },
  "adapter-svelte": {
    title: "Svelte Adapter",
    description: {
      zh: "使用 @magic-microservices/magic-svelte 消费 Svelte 编译后的组件实例协议，这里演示的是 adapter 需要的 target / $set / $destroy 合约。",
      en: "Use @magic-microservices/magic-svelte with the compiled Svelte component contract. This demo focuses on the target / $set / $destroy interface consumed by the adapter.",
    },
    html: `<svelte-card title="Svelte adapter" message="Compiled component contract works with Magic."></svelte-card>`,
    css: `body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.svelte-card {
  padding: 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.14), rgba(255, 255, 255, 0.98));
  border: 1px solid rgba(249, 115, 22, 0.2);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.svelte-card h2 {
  margin: 0 0 8px;
  color: #c2410c;
  font-size: 22px;
}

.svelte-card p {
  margin: 0;
  color: #431407;
}`,
    js: `const magic = window.magic;
let appInstance = null;

function magicSvelte(options) {
  const { component: Component, ...restOptions } = options;

  return {
    mount(container, props) {
      appInstance = new Component({
        ...restOptions,
        target: container,
        props,
      });
    },
    updated(attributeName, value, container, props) {
      (appInstance.$set || appInstance.set).call(appInstance, props);
    },
    unmount(instance, container) {
      (appInstance.$destroy || appInstance.destroy).call(appInstance);
      appInstance = null;
    },
  };
}

class SvelteStyleCard {
  constructor({ target, props }) {
    this.target = target;
    this.props = props;
    this.render();
  }

  render() {
    this.target.innerHTML = \`
      <section class="svelte-card">
        <h2>\${this.props.title}</h2>
        <p>\${this.props.message}</p>
      </section>
    \`;
  }

  $set(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
    this.render();
  }

  $destroy() {
    this.target.innerHTML = "";
  }
}

const svelteModule = magicSvelte({
  component: SvelteStyleCard,
});

magic("svelte-card", svelteModule, {
  propTypes: {
    title: String,
    message: String,
  },
});`,
  },
};

export function getMagicPlaygroundPreset(name) {
  return magicPlaygroundPresets[name] || magicPlaygroundPresets["hello-card"];
}
