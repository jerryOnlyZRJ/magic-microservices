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
