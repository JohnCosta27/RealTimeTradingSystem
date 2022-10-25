import { fromEvent, Observable, Subject } from "rxjs";
import { Component, createContext, JSX, useContext } from "solid-js";

const WEBSOCKET_URL = "ws://localhost:4545/ws";

interface WebSocketContextType {
  websocket: WebSocket;
  onOpen: Subject<Event>;
  onMessage: Subject<Event>;
  send: (data: string) => void;
}

const wsObject = new WebSocket(WEBSOCKET_URL);

const openSubject = new Subject<Event>();
const messageSubject = new Subject<Event>();
wsObject.onopen = (e) => {
  openSubject.next(e);
};

wsObject.onmessage = (e) => {
  messageSubject.next(e);
}

const ws: WebSocketContextType = {
  websocket: new WebSocket(WEBSOCKET_URL),
  onOpen: openSubject,
  onMessage: messageSubject,
  send: (data: string) => wsObject.send(data),
};

const WebSocketContext = createContext<WebSocketContextType>(ws);

interface WebSocketComponentProps {
  children: JSX.Element;
}

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
