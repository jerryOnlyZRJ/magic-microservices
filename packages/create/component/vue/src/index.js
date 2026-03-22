import Vue from 'vue';
import App from './component/Hello.vue';

let vueInstance = null;

export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(container, props) {
  console.log('magic-microservice-component-vue mount >>> ', props);
  const { createApp, h } = Vue;
  vueInstance = createApp({
    data() {
      return {
        props,
      };
    },
    render() {
      return h(App, this.props);
    },
  }).mount(container);
  console.log('vueInstance >>>', vueInstance);
}

export async function updated(attrName, value) {
  console.log('magic-microservice-component-vue update', attrName, ' >>> ', value, vueInstance);
  vueInstance.$props[attrName] = value;
  vueInstance.$forceUpdate();
}

export async function unmount() {
  console.log('vue app will unmount');
}
