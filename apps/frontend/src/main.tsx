import { render } from 'solid-js/web';
import { Component } from "solid-js";
import './main.css';

const Main: Component = () => {
  return (
    <h1 class="text-5xl">Hello World</h1>
  )
}

render(() => <Main />, document.getElementById('root') as HTMLElement);
