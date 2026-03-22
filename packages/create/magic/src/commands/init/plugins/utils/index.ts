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
import posthtml from 'posthtml'

/**
 * @description 为 browserExternals.js 追加全局变量
 * @param source
 */
export function browserExternalsTransformerGenerator(browserExternals) {
    return (source: string): string => {
        return j(source)
            .find(j.ExpressionStatement)
            .find(j.ObjectExpression)
            .forEach(path => {
                Object.keys(browserExternals).forEach(key => {
                    path.node.properties.push(
                        j.property(
                            'init',
                            j.literal(key),
                            j.literal(browserExternals[key].var),
                        ),
                    )
                })
            })
            .toSource()
    }
}

interface BrowserExternals {
    [lib: string]: {
        var: string;
        umd: string;
    };
}

/**
 * @description 为 HTML template 追加 externals CDN
 * @param source file string
 */
export function htmlTransformerGenerator(browserExternals: BrowserExternals) {
    return async (source: string): Promise<string> => {
        const res = await posthtml()
            .use(tree => {
                tree.match({ tag: 'body' }, node => {
                    const componentTagIndex = node.content.findIndex(
                        item => typeof item !== 'string' && item.tag === 'my-component',
                    )
                    node.content.splice(
                        componentTagIndex + 2,
                        0,
                        ...Object.values(browserExternals).map(
                            item =>
                                `<script src="${item.umd}" type="application/javascript"></script>\n    `,
                        ),
                    )
                    return node
                })
            })
            .process(source)
        return res.html
    }
}
