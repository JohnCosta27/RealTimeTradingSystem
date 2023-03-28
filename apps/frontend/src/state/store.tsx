import { createQuery, useQueryClient } from '@tanstack/solid-query';
import { Component, createContext, JSX, useContext } from 'solid-js';
import { createStore, Store } from 'solid-js/store';
import { GetUser, GetUserType } from '../network/requests';
import { Requests } from '../types';

// Helper type for async values
type Maybe<T> = T | undefined;
type MutateActions = 'refetch-user';

interface StoreType {
  user: Maybe<GetUserType>;
}

interface StoreContext {
  store: Store<StoreType>;
  mutate: (action: MutateActions) => void;
}

export const StoreContext = createContext<StoreContext>({
  store: {
    user: undefined,
  },
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
      return res.data.user
    }),
  );

  const mutate = (action: MutateActions) => {
    switch (action) {
      case 'refetch-user':
        query.invalidateQueries({ queryKey: [Requests.User] });
        break;
    }
  };

  const [store, setStore] = createStore<StoreType>({
    user: undefined,
  });

  return (
    <StoreContext.Provider value={{ store, mutate }}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
