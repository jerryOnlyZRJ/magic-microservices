import App from './components/App.svelte'

let appInstance = null

export async function bootstrap() {
    console.log('magic-microservice-component bootstraped')
}

export async function mount(container, props) {
    console.log('magic-microservice-component mount >>> ', props)
    appInstance = new App({
        target: container,
        props,
    })
}

export async function updated(attrName, value, container, props) {
    appInstance.$set(props)
    console.log('magic-microservice-component update >>> ', props)
}

export async function unmount() {
    console.log('magic-microservice-component will unmount')
    appInstance.$destroy()
}
