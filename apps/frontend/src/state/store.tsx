import { createQuery, useQueryClient } from '@tanstack/solid-query';
import { Subject } from 'rxjs';
import { Component, createContext, JSX, useContext } from 'solid-js';
import { createStore, Store } from 'solid-js/store';
import {
  GetAllTrades,
  GetAssets,
  GetTransaction,
  GetUser,
  GetUserAssets,
  GetUserType,
  useWebsocket,
  Requests,
} from '@network';

// Helper type for async values
type Maybe<T> = T | undefined;
type MutateActions = `refetch-${keyof StoreType}`;

interface StoreType {
  user: Maybe<GetUserType>;
  userAssets: Maybe<GetUserAssets[]>;
  assets: Maybe<GetAssets[]>;
  assetMap: Map<string, GetAssets>;
  trades: Map<string, GetTransaction>;
  notifyTrade: Subject<undefined>;
}

interface StoreContext {
  store: Store<StoreType>;
  mutate: (action: MutateActions) => void;
}

const initialStoreValue: StoreType = {
  user: undefined,
  userAssets: undefined,
  assets: undefined,
  trades: new Map(),
  assetMap: new Map(),
  notifyTrade: new Subject<undefined>(),
};

export const StoreContext = createContext<StoreContext>({
  store: initialStoreValue,
  mutate: () => {},
});

export const StoreContextProvider: Component<{ children: JSX.Element }> = (
  props,
) => {
  const query = useQueryClient();
  const ws = useWebsocket();

  const [store, setStore] = createStore<StoreType>(initialStoreValue);

  createQuery(
    () => [Requests.User],
    () =>
      GetUser().then((res) => {
        setStore({ ...store, user: res.data.user });
        return res.data;
      }),
  );

  createQuery(
    () => [Requests.UserAssets],
    () =>
      GetUserAssets().then((res) => {
        setStore({ ...store, userAssets: res.data.assets });
        return res.data;
      }),
  );

  createQuery(
    () => [Requests.AllTrades],
    () =>
      GetAllTrades().then((res) => {
        for (const trade of res.data.trades) {
          store.trades.set(trade.Id, trade);
        }
        // Send a small notification to components that might
        // need to react to this change.
        store.notifyTrade.next(undefined);
        return res.data;
      }),
  );

  createQuery(
    () => [Requests.Assets],
    () =>
      GetAssets().then((res) => {
        setStore({ ...store, assets: res.data.assets });
        for (const asset of res.data.assets) {
          store.assetMap.set(asset.Id, asset);
        }
        return res.data;
      }),
  );

  ws.onMessage.subscribe((wsTrade) => {
    store.trades.set(wsTrade.Id, wsTrade);
    store.notifyTrade.next(undefined);
  });

  function mutate(action: MutateActions) {
    switch (action) {
      case 'refetch-user':
        query.invalidateQueries({ queryKey: [Requests.User] });
        break;
      case 'refetch-userAssets':
        query.invalidateQueries({ queryKey: [Requests.UserAssets] });
        break;
      case 'refetch-trades':
        query.invalidateQueries({ queryKey: [Requests.Assets] });
    }
  }

  return (
    <StoreContext.Provider value={{ store, mutate }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
