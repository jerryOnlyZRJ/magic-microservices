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
