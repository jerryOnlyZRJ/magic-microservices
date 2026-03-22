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
