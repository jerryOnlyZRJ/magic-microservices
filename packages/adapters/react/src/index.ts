/*
 * Copyright 2021 ByteDance and/or its affiliates.
 *
 * This source code is licensed under the MIT License.
 * You may obtain a copy of the License at
 *
 *     https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root, HydrateRoot } from 'react-dom/client';
import { Module } from '@magic-microservices/magic';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export interface IMagicReactOptions<ComponentProps> {
  React: typeof React;
  ReactDOM: typeof ReactDOM;
  component: React.ComponentClass<ComponentProps> | React.FunctionComponent<ComponentProps>;
  renderType?: 'hydrate' | 'render';
}

function getRenderComponent<ComponentProps>(options: IMagicReactOptions<ComponentProps>, props: ComponentProps) {
  const { React, component } = options;
  return React.createElement(component, props);
}

// Store root instances for unmount
const rootMap = new WeakMap<Element, Root | HydrateRoot>();

export function mountGenerator<ComponentProps>(options: IMagicReactOptions<ComponentProps>) {
  const { ReactDOM, renderType } = options;
  const mount: Module<ComponentProps>['mount'] = function (container, props, _magicInstance) {
    const renderResultComponent = getRenderComponent(options, props);
    if (renderType === 'hydrate') {
      const root = ReactDOM.hydrateRoot(container, renderResultComponent);
      rootMap.set(container, root);
    } else {
      const root = ReactDOM.createRoot(container);
      root.render(renderResultComponent);
      rootMap.set(container, root);
    }
  };
  return mount;
}

export function updatedGenerator<ComponentProps>(options: IMagicReactOptions<ComponentProps>) {
  const { ReactDOM, renderType } = options;
  const updated: Module<ComponentProps>['updated'] = function (_attrName, _value, container, props, _prevValue, _magicInstance) {
    const renderResultComponent = getRenderComponent(options, props);
    if (renderType === 'hydrate') {
      // hydrateRoot does not support re-rendering in the same way
      // For hydrated apps, you typically need to use different strategies
      // Here we just re-call hydrateRoot which is a simplification
      const root = ReactDOM.hydrateRoot(container, renderResultComponent);
      rootMap.set(container, root);
    } else {
      const root = ReactDOM.createRoot(container);
      root.render(renderResultComponent);
      rootMap.set(container, root);
    }
  };
  return updated;
}

export function unmountGenerator<ComponentProps>(options: IMagicReactOptions<ComponentProps>) {
  const unmount: Module<ComponentProps>['unmount'] = function (_magicInstance, container) {
    const root = rootMap.get(container);
    if (root) {
      root.unmount();
      rootMap.delete(container);
    }
  };
  return unmount;
}

export default function magicReact<ComponentProps extends {} = Record<string, unknown>>(
  options: IMagicReactOptions<ComponentProps>,
): Module<ComponentProps> {
  return {
    bootstrap: noop,
    mount: mountGenerator<ComponentProps>(options),
    updated: updatedGenerator<ComponentProps>(options),
    unmount: unmountGenerator<ComponentProps>(options),
  };
}
