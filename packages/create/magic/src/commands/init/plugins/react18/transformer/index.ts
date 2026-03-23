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

import j from 'jscodeshift'
import {
    browserExternalsTransformerGenerator,
    htmlTransformerGenerator,
} from '../../utils'

import { browserExternals } from '../config'

/**
 * @description 为 browserExternals.js 追加全局变量
 * @param source
 */
export const browserExternalsTransformer = browserExternalsTransformerGenerator(
    browserExternals,
)

/**
 * @description 为 HTML template 追加 externals CDN
 * @param source file string
 */
export const htmlTransformer = htmlTransformerGenerator(browserExternals)

/**
 * @description 为 babel 追加 react 相关配置
 * @param source
 */
export function babelFileTransformer(source: string): string {
    return j(source)
        .find(j.ExpressionStatement)
        .find(j.Property, { key: { name: 'presets' } })
        .forEach(path => {
            path.node.value.elements.push('\'@babel/preset-react\'')
        })
        .toSource()
}
