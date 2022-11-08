import { render } from "solid-js/web";
import { Component } from "solid-js";
import { WebSocketComponent } from "./network/WebSocket";
import { Test } from "./Test";
import "./main.css";
import { QueryProvider } from "./network/QueryProvider";
import { AuthProvider } from "./auth/AuthProvider";

const Main: Component = () => {
  return (
    <QueryProvider>
      <WebSocketComponent>
        <AuthProvider>
          <h1 class="text-5xl">Hello World</h1>
          <Test />
        </AuthProvider>
      </WebSocketComponent>
    </QueryProvider>
  );
};

render(() => <Main />, document.getElementById("root") as HTMLElement);
