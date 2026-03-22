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

export function mountGenerator<ComponentProps>(options: IMagicReactOptions<ComponentProps>) {
  const { ReactDOM, renderType } = options;
  const mount: Module<ComponentProps>['mount'] = function (container, props) {
    const renderResultComponent = getRenderComponent(options, props);
    ReactDOM[renderType === 'hydrate' ? 'hydrate' : 'render'](renderResultComponent, container);
  };
  return mount;
}

export function updatedGenerator<ComponentProps>(options: IMagicReactOptions<ComponentProps>) {
  const { ReactDOM, renderType } = options;
  const updated: Module<ComponentProps>['updated'] = function (_attrName, _value, container, props) {
    const renderResultComponent = getRenderComponent(options, props);
    ReactDOM[renderType === 'hydrate' ? 'hydrate' : 'render'](renderResultComponent, container);
  };
  return updated;
}

export function unmountGenerator<ComponentProps>(options: IMagicReactOptions<ComponentProps>) {
  const { ReactDOM } = options;
  const unmount: Module<ComponentProps>['unmount'] = function (_magicInstance, container) {
    ReactDOM.unmountComponentAtNode(container);
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
