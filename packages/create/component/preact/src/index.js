import { h, render, hydrate, cloneElement } from 'preact';
import Hello from './component/Hello.jsx';

let component = null;

export async function bootstrap() {
  console.log('magic-microservices-component bootstraped');
}

export async function mount(container, props) {
  console.log('magic-microservices-component mount >>> ', props);
  component = h(Hello, props, null);
  (render || hydrate)(component, container);
}

export async function updated(attrName, value, container, props) {
  console.log('magic-microservices-component update >>> ', props);
  component = cloneElement(component, props);
  render(component, container);
}

export async function unmount(_void, container) {
  console.log('magic-microservices-component will unmount >>>', _void, container);
  debugger;
  render((component = null), container);
}
