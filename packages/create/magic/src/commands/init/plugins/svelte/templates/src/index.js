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

import App from './components/App.svelte'

let appInstance = null

export async function bootstrap() {
    console.log('magic-microservice-component bootstraped')
}

export async function mount(container, props) {
    console.log('magic-microservice-component mount >>> ', props)
    appInstance = new App({
        target: container,
        props,
    })
}

export async function updated(attrName, value, container, props) {
    appInstance.$set(props)
    console.log('magic-microservice-component update >>> ', props)
}

export async function unmount() {
    console.log('magic-microservice-component will unmount')
    appInstance.$destroy()
}
