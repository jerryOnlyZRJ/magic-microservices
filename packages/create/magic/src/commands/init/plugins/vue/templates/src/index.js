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
