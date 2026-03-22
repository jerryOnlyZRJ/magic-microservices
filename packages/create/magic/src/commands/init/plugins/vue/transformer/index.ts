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

export function buildConfigTransformer(source: string): string {
    // build 增加 vue 相关 plugin
    let res = j(source)
        .find(j.Program)
        .forEach(path => {
            path.node.body.unshift('const vue = require(\'rollup-plugin-vue\');')
        })
        .toSource()

    res = j(res)
        .find(j.FunctionDeclaration, { id: { name: 'genConfig' } })
        .find(j.Property, { key: { name: 'plugins' } })
        .forEach(path => {
            path.node.value.callee.object.elements.unshift('vue({ css: false })')
        })
        .toSource()

    return res
}
