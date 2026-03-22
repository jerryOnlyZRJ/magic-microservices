import React from 'react';
import ReactDOM from 'react-dom';
import magicReact from '@magic-microservices/magic-react';
import Hello from './component/Hello.jsx';

const { bootstrap, mount, updated, unmount } = magicReact({
  React,
  ReactDOM,
  renderComponent: Hello,
});

export { bootstrap, mount, updated, unmount };
