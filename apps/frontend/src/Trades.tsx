import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import { Component, createEffect, For, Match, Show, Switch } from 'solid-js';
import { useAuth } from './auth/AuthProvider';
import {
  GetAllTrades,
  GetAssets,
  GetUserAssets,
  PostCompleteTransaction,
} from './network/requests';
import { CreateTransaction } from './ui/CreateTransaction';
import { Loading } from './ui/Loading';
import { TradeCard } from './ui/TradeCard';

export const Trades: Component = () => {
  const auth = useAuth();
  const query = useQueryClient();

  const assets = createQuery(
    () => ['assets'],
    () => GetAssets(auth().access).then((res) => res.data),
  );

  const userAssets = createQuery(
    () => ['userAssets'],
    () => GetUserAssets(auth().access).then((res) => res.data),
  );

  const allTrades = createQuery(
    () => ['all-trades'],
    () => GetAllTrades(auth().access).then((res) => res.data),
  );

  const completeTrade = createMutation({
    mutationFn: PostCompleteTransaction,
    onSuccess: (res) => {
      console.log(res);
      query.invalidateQueries({ queryKey: ['all-trades'] });
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
    <div class="w-full h-full p-4 grid grid-cols-2 grid-rows-4 gap-4">
      <div class="w-full col-span-1 row-span-2 bg-neutral-focus rounded shadow-lg flex flex-col p-4 overflow-y-auto">
        <h2 class="text-2xl mb-2">Buy</h2>
        <Show when={allTrades.data} fallback={<Loading />}>
          <For each={allTrades.data!.trades.filter((t) => t.SellerId === '')}>
            {(trade) => <TradeCard trade={trade} complete={tradeCallback} />}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-1 row-span-2 bg-neutral-focus rounded shadow-lg flex flex-col p-4 overflow-y-auto">
        <h2 class="text-2xl mb-2">Sell</h2>
        <Show when={allTrades.data} fallback={<Loading />}>
          <For each={allTrades.data!.trades.filter((t) => t.BuyerId === '')}>
            {(trade) => <TradeCard trade={trade} complete={tradeCallback} />}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-2 row-span-2 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <h2 class="text-2xl">Create Trade</h2>
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
