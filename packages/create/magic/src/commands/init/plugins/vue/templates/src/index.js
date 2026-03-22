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

import Vue from 'vue/index'
import App from './component/Hello.vue'

let vueInstance = null

export async function bootstrap() {
    console.log('vue app bootstraped')
}

export async function mount(container, props) {
    console.log('magic-microservice-component-vue mount >>> ', props)
    vueInstance = Vue.createApp({
        ...App,
        data() {
            return props
        },
    }).mount(container)
}

export async function updated(attrName, value) {
    console.log('magic-microservice-component-vue update', attrName, ' >>> ', value)
    vueInstance[attrName] = value
    vueInstance.$forceUpdate()
}

export async function unmount() {
    console.log('vue app will unmount')
}
