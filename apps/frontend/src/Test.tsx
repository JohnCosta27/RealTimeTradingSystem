import { Component, createSignal } from "solid-js";
import { useWebsocket } from "./network/WebSocket";

export const Test: Component = () => {
  const [value, setValue] = createSignal("");
  const ws = useWebsocket();
  return (
    <>
      <p>Test Component</p>
      <input
        class="input input-secondary"
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <button
        class="btn"
        onClick={() => {
          console.log("Sent: ", value());
          ws.websocket.send(value());
        }}
      >
        Click to send message
      </button>
    </>
  );
};
