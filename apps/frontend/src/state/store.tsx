import { createQuery, useQueryClient } from '@tanstack/solid-query';
import { Component, createContext, JSX, useContext } from 'solid-js';
import { createStore, Store } from 'solid-js/store';
import { GetUser, GetUserAssets, GetUserType } from '../network/requests';
import { Requests } from '../types';

// Helper type for async values
type Maybe<T> = T | undefined;
type MutateActions = `refetch-${keyof StoreType}`;

interface StoreType {
  user: Maybe<GetUserType>;
  userAssets: Maybe<GetUserAssets[]>;
}

interface StoreContext {
  store: Store<StoreType>;
  mutate: (action: MutateActions) => void;
}

const initialStoreValue: StoreType = {
    user: undefined,
    userAssets: undefined,
  }

export const StoreContext = createContext<StoreContext>({
  store: initialStoreValue,
  mutate: () => {},
});

export const StoreContextProvider: Component<{ children: JSX.Element }> = (
  props,
) => {
  const query = useQueryClient();

  createQuery(
    () => [Requests.User],
    () => GetUser().then((res) => {
      setStore({...store, user: res.data.user});
      return res.data;
    }),
  );

  createQuery(
    () => [Requests.UserAssets],
    () => GetUserAssets().then((res) => {
      setStore({...store, userAssets: res.data.assets});
      return res.data;
    }),
  );


  const mutate = (action: MutateActions) => {
    switch (action) {
      case 'refetch-user':
        query.invalidateQueries({ queryKey: [Requests.User] });
        break;
      case 'refetch-userAssets':
        query.invalidateQueries({queryKey: [Requests.UserAssets]})
        break;
    }
  };

  const [store, setStore] = createStore<StoreType>(initialStoreValue);

  return (
    <StoreContext.Provider value={{ store, mutate }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
