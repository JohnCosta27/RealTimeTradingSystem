import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import { Component, createEffect, For, Show } from 'solid-js';
import { useAuth } from './auth/AuthProvider';
import {
  GetAllTrades,
  GetAssets,
  GetTransaction,
  GetUserAssets,
  PostCompleteTransaction,
} from './network/requests';
import { useWebsocket } from './network/WebSocket';
import { Requests } from './types';
import { CreateTransaction } from './ui/CreateTransaction';
import { Loading } from './ui/Loading';
import { TradeCard } from './ui/TradeCard';

export const Trades: Component = () => {
  const auth = useAuth();
  const query = useQueryClient();
  const ws = useWebsocket();

  ws.onMessage.subscribe((m) => {
    query.setQueryData([Requests.AllTrades], (oldData) => {
      const oldTrades = (oldData as { trades: GetTransaction[] }).trades;

      const exists = oldTrades.findIndex(t => t.Id === m.Id);
      if (exists !== -1) {
       // Trade already exists, so we have to replace it. 
        return {
          trades: [m, ...oldTrades.slice(0, exists), ...oldTrades.slice(exists + 1)],
        }
      } else {
      return {
        trades: [oldTrades, m],
      };
      }
    });
  });

  const assets = createQuery(
    () => [Requests.Assets],
    () => GetAssets(auth().access).then((res) => res.data),
  );

  const userAssets = createQuery(
    () => [Requests.UserAssets],
    () => GetUserAssets(auth().access).then((res) => res.data),
  );

  const allTrades = createQuery(
    () => [Requests.AllTrades],
    () => GetAllTrades(auth().access).then((res) => res.data),
  );

  const completeTrade = createMutation({
    mutationFn: PostCompleteTransaction,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: [Requests.AllTrades] });
      query.invalidateQueries({ queryKey: [Requests.UserAssets] });
      query.invalidateQueries({ queryKey: [Requests.User] });
    },
  });

  const tradeCallback = (TransactionId: string) => {
    completeTrade.mutate({
      access: auth().access || '',
      body: {
        TransactionId,
      },
    });
  };

  return (
    <div class="w-full p-4 grid grid-cols-2 grid-rows-5 gap-4 overflow-y-auto max-h-[120vh]">
      <div class="w-full col-span-1 row-span-3 bg-neutral-focus rounded shadow-lg flex flex-col p-4 overflow-y-auto gap-2">
        <h2 class="text-2xl mb-2">Buy</h2>
        <Show when={allTrades.data} fallback={<Loading />}>
          <For each={allTrades.data!.trades.filter((t) => t.SellerId === '')}>
            {(trade) => <TradeCard trade={trade} complete={tradeCallback} />}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-1 row-span-3 bg-neutral-focus rounded shadow-lg flex flex-col p-4 overflow-y-auto">
        <h2 class="text-2xl mb-2">Sell</h2>
        <Show when={allTrades.data} fallback={<Loading />}>
          <For each={allTrades.data!.trades.filter((t) => t.BuyerId === '')}>
            {(trade) => <TradeCard trade={trade} complete={tradeCallback} />}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-2 row-span-2 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <Show when={userAssets.data && assets.data} fallback={<Loading />}>
          <CreateTransaction
            assets={userAssets.data!.assets}
            allAssets={assets.data!.assets}
          />
        </Show>
      </div>
    </div>
  );
};
