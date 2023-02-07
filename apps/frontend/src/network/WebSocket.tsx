import { Component, createContext, JSX, useContext } from "solid-js";
import { Subject } from "rxjs";

interface WebSocketContextType {
  websocket: WebSocket;
  onOpen: Subject<Event>;
  onMessage: Subject<Event>;
  send: (data: string) => void;
}

interface WebSocketComponentProps {
  children: JSX.Element;
}


export const WebsocketUrl = import.meta.env.VITE_HUB_WS_URL ?? "ws://localhost:4545/ws";

const wsObject = new WebSocket(WebsocketUrl);
const openSubject = new Subject<Event>();
const messageSubject = new Subject<Event>();
setTimeout(() => {
  wsObject.send("rabbit hello world")
}, 1000);

wsObject.onopen = (e) => {
  openSubject.next(e);
};
wsObject.onmessage = (e) => {
  messageSubject.next(e);
}

const ws: WebSocketContextType = {
  websocket: wsObject,
  onOpen: openSubject,
  onMessage: messageSubject,
  send: wsObject.send,
};

const WebSocketContext = createContext<WebSocketContextType>(ws);

export const WebSocketComponent: Component<WebSocketComponentProps> = (
  props
) => {
  return (
    <WebSocketContext.Provider value={ws}>
      {props.children}
    </WebSocketContext.Provider>
  );
};

export const useWebsocket = () => useContext(WebSocketContext);
