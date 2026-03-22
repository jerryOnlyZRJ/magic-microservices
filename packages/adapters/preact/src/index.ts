import * as preact from 'preact';
import { ComponentType, VNode } from 'preact';
import { Module } from '@magic-microservices/magic';

let renderComponent: VNode<any> | null = null;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export interface IMagicPreactOptions<ComponentProps> {
  preact: typeof preact;
  component: ComponentType<ComponentProps>;
  renderType?: 'hydrate' | 'render';
}

export function mountGenerator<ComponentProps>(options: IMagicPreactOptions<ComponentProps>) {
  const { preact, component, renderType = 'render' } = options;
  const { h } = preact;
  const mount: Module<ComponentProps>['mount'] = function (container, props) {
    renderComponent = h(component, props, null);
    preact[renderType](renderComponent, container);
  };
  return mount;
}

export function updatedGenerator<ComponentProps>(options: IMagicPreactOptions<ComponentProps>) {
  const {
    preact: { render, cloneElement },
  } = options;
  const updated: Module<ComponentProps>['updated'] = function (_attrName, _value, container, props) {
    renderComponent = cloneElement(renderComponent as VNode, props);
    render(renderComponent, container);
  };
  return updated;
}

export function unmountGenerator<ComponentProps>(options: IMagicPreactOptions<ComponentProps>) {
  const {
    preact: { render },
  } = options;
  const unmount: Module<ComponentProps>['unmount'] = function (_magicInstance, container) {
    render((renderComponent = null), container);
  };
  return unmount;
}

export default function magicPreact<ComponentProps extends {} = Record<string, unknown>>(
  options: IMagicPreactOptions<ComponentProps>,
): Module<ComponentProps> {
  return {
    bootstrap: noop,
    mount: mountGenerator<ComponentProps>(options),
    updated: updatedGenerator<ComponentProps>(options),
    unmount: unmountGenerator<ComponentProps>(options),
  };
}
