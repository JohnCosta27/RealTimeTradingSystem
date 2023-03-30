import { createQuery, useQueryClient } from '@tanstack/solid-query';
import { Subject } from 'rxjs';
import { Component, createContext, useContext } from 'solid-js';
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
import { Outlet } from '@solidjs/router';

// Helper type for async values
type Maybe<T> = T | undefined;
type MutateActions = `refetch-${keyof StoreType}`;

// Type of the entire store.
interface StoreType {
  user: Maybe<GetUserType>;
  userAssets: Maybe<GetUserAssets[]>;
  assets: Maybe<GetAssets[]>;
  assetMap: Map<string, GetAssets>;
  trades: Map<string, GetTransaction>;
  notifyTrade: Subject<undefined>;
}

// Context type.
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

/**
 * The store provides a global and efficnent way to access shared state,
 * throughout the application. It just needs to rendered above other
 * components that are using it.
 *
 * It contains most of the queries the client makes to the server,
 * and strategically updates the store as needed, which in turn will
 * update components that are below them.
 */
export const StoreContextProvider: Component = () => {
  const query = useQueryClient();
  const ws = useWebsocket();

  const [store, setStore] = createStore<StoreType>(initialStoreValue);

  // User information query
  createQuery(
    () => [Requests.User],
    () =>
      GetUser().then((res) => {
        setStore({ ...store, user: res.data.user });
        return res.data;
      }),
  );

  // User asset query.
  createQuery(
    () => [Requests.UserAssets],
    () =>
      GetUserAssets().then((res) => {
        setStore({ ...store, userAssets: res.data.assets });
        return res.data;
      }),
  );

  // Get all trades query.
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

  // Get all assets query.
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

  // When we have a new web socket message (new trade).
  // We need to update our trades map, which is used to efficiently,
  // remove trades from view. We also send a message through our
  // observable so that components know to update their views.
  ws.onMessage.subscribe((wsTrade) => {
    store.trades.set(wsTrade.Id, wsTrade);
    store.notifyTrade.next(undefined);
  });

  // Wrapper function to refetch various state in the store.
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
      <Outlet />
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
