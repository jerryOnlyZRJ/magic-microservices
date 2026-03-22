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
