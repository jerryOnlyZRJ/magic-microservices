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
