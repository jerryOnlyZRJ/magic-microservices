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

import React from 'react'
import ReactDOM from 'react-dom'
import Hello from './component/Hello.jsx'

export async function bootstrap() {
    console.log('magic-microservice-component bootstraped')
}

export async function mount(container, props) {
    console.log('magic-microservice-component mount >>> ', props)
    ReactDOM.render(React.createElement(Hello, props, null), container)
}

export async function updated(attrName, value, container, props) {
    console.log('magic-microservice-component update >>> ', props)
    ReactDOM.render(React.createElement(Hello, props, null), container)
}

export async function unmount() {
    console.log('magic-microservice-component will unmount')
}
