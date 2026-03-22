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

import { h, render, hydrate, cloneElement } from 'preact';
import Hello from './component/Hello.jsx';

let component = null;

export async function bootstrap() {
  console.log('magic-microservices-component bootstraped');
}

export async function mount(container, props) {
  console.log('magic-microservices-component mount >>> ', props);
  component = h(Hello, props, null);
  (render || hydrate)(component, container);
}

export async function updated(attrName, value, container, props) {
  console.log('magic-microservices-component update >>> ', props);
  component = cloneElement(component, props);
  render(component, container);
}

export async function unmount(_void, container) {
  console.log('magic-microservices-component will unmount >>>', _void, container);
  debugger;
  render((component = null), container);
}
