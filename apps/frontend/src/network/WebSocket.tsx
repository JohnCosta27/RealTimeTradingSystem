import { Component, createContext, JSX, useContext } from "solid-js";
import { Subject } from "rxjs";
import { GetTransaction } from "./requests";

interface WebSocketContextType {
  websocket: WebSocket;
  onOpen: Subject<Event>;
  onMessage: Subject<GetTransaction>;
  send: (data: string) => void;
}

interface WebSocketComponentProps {
  children: JSX.Element;
}

export const WebsocketUrl = import.meta.env.VITE_HUB_WS_URL ?? "ws://localhost:4545/ws";

// Various RxJS channels to be used for websockets.
const wsObject = new WebSocket(WebsocketUrl);
const openSubject = new Subject<Event>();
const messageSubject = new Subject<GetTransaction>();

wsObject.onopen = (e) => {
  openSubject.next(e);
};
wsObject.onmessage = (e) => {
  try {
    // Type casting is necessary because this information comes from
    // an external source. However I control the external source, so
    // it is safe. Either way there is a try catch, in case parsing
    // isn't successful.
    const parsedMessage = JSON.parse(e.data) as GetTransaction;
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

/**
 * Should be rendered above the components that use this context.
 */
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
