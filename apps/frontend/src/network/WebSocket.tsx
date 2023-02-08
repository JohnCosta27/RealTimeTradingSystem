import { Component, createContext, JSX, useContext } from "solid-js";
import { Subject } from "rxjs";

interface WebSocketContextType {
  websocket: WebSocket;
  onOpen: Subject<Event>;
  onMessage: Subject<object>;
  send: (data: string) => void;
}

interface WebSocketComponentProps {
  children: JSX.Element;
}

export const WebsocketUrl = import.meta.env.VITE_HUB_WS_URL ?? "ws://localhost:4545/ws";

const wsObject = new WebSocket(WebsocketUrl);
const openSubject = new Subject<Event>();
const messageSubject = new Subject<object>();

wsObject.onopen = (e) => {
  openSubject.next(e);
};
wsObject.onmessage = (e) => {
  try {
    const parsedMessage = JSON.parse(e.data);
    messageSubject.next(parsedMessage);
  } catch (e) {
    console.error("Websockets message recieved invalid JSON, likely a server issue.");
  }
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
