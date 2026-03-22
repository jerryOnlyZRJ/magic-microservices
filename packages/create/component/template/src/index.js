export async function bootstrap() {
  console.log('magic-microservice-component bootstraped');
}

export async function mount(container, props) {
  console.log('magic-microservice-component mount >>> ', props);
  container.innerHTML = 'Hello magic!';
}

export async function updated(attrName, value, container, props) {
  console.log('magic-microservice-component update >>> ', props);
}

export async function unmount() {
  console.log('magic-microservice-component will unmount');
}
