/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import EventEmiter from 'wolfy87-eventemitter'

import magic, { useProps } from '@magic-microservices/magic'
import * as ReactModule from '@magic-microservices/component-react'
import * as VueModule from '@magic-microservices/component-vue'

class MagicPlugin {
  apply(lifeCycle) {
    console.log('plugin apply >>> ', JSON.parse(JSON.stringify(lifeCycle)))
    lifeCycle.hooks.beforeOptionsInit.tap(lifeCycle => {
      console.log('plugin beforeOptionsInit >>>', JSON.parse(JSON.stringify(lifeCycle)))
    })
    lifeCycle.hooks.alterHTMLTags.tap(lifeCycle => {
      console.log('plugin afterTagsFormat >>>', JSON.parse(JSON.stringify(lifeCycle)))
    })
    lifeCycle.hooks.beforeElementDefinition.tap(lifeCycle => {
      console.log('plugin beforeElementDefinition >>>', JSON.parse(JSON.stringify(lifeCycle)))
    })
  }
}

// umd 引入模式
magic('custom-component-react-umd', window.MagicMicroserviceComponentReact, {
  shadow: true,
  propTypes: {
    id: String,
    test: Boolean,
    callback: Function,
    count: Number,
  },
  styles: ['http://unpkg.pstatp.com/byted-cg/magic-microservice-component-react/1.0.3/dist/index.min.css'],
  plugins: [new MagicPlugin()],
})
magic('custom-component-vue-umd', window.MagicMicroserviceComponentVue, {
  propTypes: {
    id: String,
    test: Boolean,
    name: String,
    count: Number,
  },
  styles: ['https://unpkg.pstatp.com/byted-cg/magic-microservice-component-vue/1.0.3/dist/index.min.css'],
})

// npm 引入
magic('custom-component-react-cjs', ReactModule, {
  shadow: true,
  propTypes: {
    id: String,
    test: Boolean,
    callback: Function,
    count: Number,
  },
  styles: ['http://unpkg.pstatp.com/byted-cg/magic-microservice-component-react/1.0.3/dist/index.min.css'],
})
magic('custom-component-vue-cjs', VueModule, {
  propTypes: {
    id: String,
    test: Boolean,
    name: String,
    count: Number,
  },
  styles: ['https://unpkg.pstatp.com/byted-cg/magic-microservice-component-vue/1.0.3/dist/index.min.css'],
})

// ========================================================
// Store Instantiation
// ========================================================
global.Emiter = new EventEmiter()

function ComponentContainer() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>count + 1</button>
      <custom-component-react-cjs
        id="custom-component-react-cjs"
        test
        count={count}
        callback={useProps(() => 'test')}
      ></custom-component-react-cjs>
      <custom-component-react-umd
        id="custom-component-react-umd"
        test
        count={count}
        callback={useProps(() => 'test')}
      ></custom-component-react-umd>
      <magic-component-react-system
        id="magic-component-react-system"
        test
        count={count}
        callback={useProps(() => 'test')}
      ></magic-component-react-system>
      <custom-component-vue-cjs id="123" test count={count} name="Tom"></custom-component-vue-cjs>
      <custom-component-vue-umd id="123" test count={count} name="Spike"></custom-component-vue-umd>
      <magic-component-vue-system id="123" test count={count} name="Tyke"></magic-component-vue-system>
    </div>
  )
}

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')
let render = async () => {
  ReactDOM.render(<ComponentContainer />, MOUNT_NODE)
}

// ========================================================
// Go!
// ========================================================
render()
