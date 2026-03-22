import Vue, { Component, App, ComponentPublicInstance } from 'vue';
import { Module } from '@magic-microservices/magic';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

let vueInstance: ComponentPublicInstance | null = null;

export interface IMagicVueOptions<ComponentProps> {
  Vue: typeof Vue;
  component: Component<ComponentProps>;
  handleApp?: (app: App) => void;
}

export function mountGenerator<ComponentProps>(options: IMagicVueOptions<ComponentProps>) {
  const {
    Vue: { createApp, h },
    component,
    handleApp,
  } = options;
  const mount: Module<ComponentProps>['mount'] = function (container, props) {
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
    Promise.resolve(handleApp?.(app)).then(() => {
      vueInstance = app.mount(container);
    });
  };
  return mount;
}

export function updatedGenerator<ComponentProps>(options: IMagicVueOptions<ComponentProps>) {
  const updated: Module<ComponentProps>['updated'] = function (attrName, value) {
    (vueInstance as ComponentPublicInstance<ComponentProps>).$props[attrName] = value;
    vueInstance!.$forceUpdate();
  };
  return updated;
}

export function unmountGenerator<ComponentProps>(options: IMagicVueOptions<ComponentProps>) {
  const {
    Vue: { render },
  } = options;
  const unmount: Module<ComponentProps>['unmount'] = function (_magicInstance, container) {
    render(null, container);
    vueInstance = null;
  };
  return unmount;
}

export default function magicVue<ComponentProps extends {} = Record<string, unknown>>(
  options: IMagicVueOptions<ComponentProps>,
): Module<ComponentProps> {
  return {
    bootstrap: noop,
    mount: mountGenerator<ComponentProps>(options),
    updated: updatedGenerator<ComponentProps>(options),
    unmount: unmountGenerator<ComponentProps>(options),
  };
}
