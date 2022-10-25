import { render } from "solid-js/web";
import { Component } from "solid-js";
import { WebSocketComponent } from "./network/WebSocket";
import "./main.css";

const Main: Component = () => {
  return (
    <WebSocketComponent>
      <h1 class="text-5xl">Hello World</h1>
    </WebSocketComponent>
  );
};

render(() => <Main />, document.getElementById("root") as HTMLElement);
