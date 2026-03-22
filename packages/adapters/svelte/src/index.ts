import { Module } from '@magic-microservices/magic';
import { SvelteComponentTyped } from 'svelte';

let appInstance: SvelteComponentTyped | null = null;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface IComponentOptions<Props extends Record<string, any> = Record<string, any>> {
  target: Element | ShadowRoot;
  anchor?: Element;
  props?: Props;
  context?: Map<any, any>;
  hydrate?: boolean;
  intro?: boolean;
  $$inline?: boolean;
}

type SvelteComponentClass<ComponentProps> = {
  new (options: IComponentOptions<ComponentProps>): SvelteComponentTyped<ComponentProps>;
};

export type IMagicSvelteOptions<ComponentProps> = {
  component: SvelteComponentClass<ComponentProps>;
} & Omit<IComponentOptions<ComponentProps>, 'target' | 'props'>;

export function mountGenerator<ComponentProps>(options: IMagicSvelteOptions<ComponentProps>) {
  const { component: Component, ...restOptions } = options;
  const mount: Module<ComponentProps>['mount'] = function (container, props) {
    appInstance = new Component({
      ...restOptions,
      target: container,
      props,
    });
  };
  return mount;
}

export function updatedGenerator<ComponentProps>(options: IMagicSvelteOptions<ComponentProps>) {
  const updated: Module<ComponentProps>['updated'] = function (_attrName, _value, container, props) {
    (appInstance!.$set || appInstance!.set).call(appInstance, props);
  };
  return updated;
}

export function unmountGenerator<ComponentProps>(options: IMagicSvelteOptions<ComponentProps>) {
  const unmount: Module<ComponentProps>['unmount'] = function (_magicInstance, container) {
    (appInstance!.$destroy || appInstance!.destroy).call(appInstance);
    appInstance = null;
  };
  return unmount;
}

export default function magicSvelte<ComponentProps extends {} = Record<string, unknown>>(
  options: IMagicSvelteOptions<ComponentProps>,
): Module<ComponentProps> {
  return {
    bootstrap: noop,
    mount: mountGenerator<ComponentProps>(options),
    updated: updatedGenerator<ComponentProps>(options),
    unmount: unmountGenerator<ComponentProps>(options),
  };
}
