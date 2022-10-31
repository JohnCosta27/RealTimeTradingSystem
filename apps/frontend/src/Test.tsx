import { Component } from "solid-js";
import { useWebsocket } from "./network/WebSocket";

export const Test: Component = () => {
  const ws = useWebsocket();
  ws.send("Hello World");
  return (
    <p>Test Component</p>
  );
}
