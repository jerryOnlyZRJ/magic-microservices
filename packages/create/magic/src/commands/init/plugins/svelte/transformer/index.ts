import j from 'jscodeshift'

export function buildConfigTransformer(source: string): string {
    // build 增加 svelte 相关 plugin
    let res = j(source)
        .find(j.Program)
        .forEach(path => {
            path.node.body.unshift('const svelte = require("rollup-plugin-svelte");')
        })
        .toSource()

    res = j(res)
        .find(j.FunctionDeclaration, { id: { name: 'genConfig' } })
        .find(j.Property, { key: { name: 'plugins' } })
        .forEach(path => {
            path.node.value.callee.object.elements.unshift(`svelte({
                        include: 'src/components/**/*.svelte',
                      })`)
        })
        .toSource()

    return res
}
