export default {
    dependencies: ['vue@next'],
    devDependencies: ['@vue/compiler-sfc', 'eslint-plugin-vue', 'rollup-plugin-vue'],
}

export const browserExternals = {
    vue: {
        var: 'Vue',
        umd: 'https://cdn.bootcdn.net/ajax/libs/vue/3.0.0-rc.5/vue.runtime.global.js',
    },
}
