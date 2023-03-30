import { createMutation } from '@tanstack/solid-query';
import { Component, createSignal, For, onCleanup, Show } from 'solid-js';
import { PostCompleteTransaction } from '@network';
import { useStore } from '@state';
import { CreateTransaction, Loading, TradeCard } from '@ui';

/**
 * Renders the trades that are present in the system, and updates them as
 * we get web socket requests that new trades are coming on (or closing).
 *
 * It also allows the user to create trades, but most of the login is in another component.
 */
export const Trades: Component = () => {
  const { store, mutate } = useStore();

  const [trades, setTrades] = createSignal(Array.from(store.trades.values()));

  const tradeSub = store.notifyTrade.subscribe(() => {
    setTrades(Array.from(store.trades.values()));
  });

  onCleanup(() => {
    tradeSub.unsubscribe();
  });

  const completeTrade = createMutation({
    mutationFn: PostCompleteTransaction,
    onSuccess: () => {
      mutate('refetch-trades');
      mutate('refetch-userAssets');
      mutate('refetch-user');
    },
  });

  const tradeCallback = (TransactionId: string) => {
    completeTrade.mutate({
      TransactionId,
    });
  };

  return (
    <div class="w-full h-full p-4 grid grid-cols-3 gap-4 overflow-y-auto">
      <div class="w-full h-full col-span-1 bg-neutral-focus rounded shadow-lg flex flex-col gap-4 p-4 overflow-y-auto">
        <h2 class="text-2xl mb-2">Buy</h2>
        <Show when={trades()} fallback={<Loading />}>
          <For each={trades().filter((t) => t.SellerId === '')}>
            {(trade) => <TradeCard trade={trade} complete={tradeCallback} asset={store.assetMap.get(trade.AssetId)} />}
          </For>
        </Show>
      </div>
      <div class="w-full h-full col-span-1 bg-neutral-focus rounded shadow-lg flex flex-col gap-4 p-4 overflow-y-auto">
        <h2 class="text-2xl mb-2">Sell</h2>
        <Show when={trades() && store.user} fallback={<Loading />}>
          <For each={trades().filter((t) => t.BuyerId === '')}>
            {(trade) => (
              <TradeCard
                trade={trade}
                complete={tradeCallback}
                disabled={trade.Price > store.user!.Balance}
                asset={store.assetMap.get(trade.AssetId)}
              />
            )}
          </For>
        </Show>
      </div>
      <div class="w-full h-full col-span-1 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <Show when={store.userAssets && store.assets} fallback={<Loading />}>
          <CreateTransaction
            assets={store.userAssets!}
            allAssets={store.assets!}
          />
        </Show>
      </div>
    </div>
  );
};
