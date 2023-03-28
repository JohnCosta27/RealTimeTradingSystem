import { createMutation } from '@tanstack/solid-query';
import { Component, createSignal, For, onCleanup, Show } from 'solid-js';
import { PostCompleteTransaction } from '@network';
import { useStore } from '@state';
import { CreateTransaction, Loading, TradeCard } from '@ui';

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
    <div class="w-full p-4 grid grid-cols-2 grid-rows-5 gap-4 overflow-y-auto max-h-[120vh]">
      <div class="w-full col-span-1 row-span-3 bg-neutral-focus rounded shadow-lg flex flex-col p-4 overflow-y-auto gap-2">
        <h2 class="text-2xl mb-2">Buy</h2>
        <Show when={trades()} fallback={<Loading />}>
          <For each={trades().filter((t) => t.SellerId === '')}>
            {(trade) => <TradeCard trade={trade} complete={tradeCallback} />}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-1 row-span-3 bg-neutral-focus rounded shadow-lg flex flex-col p-4 overflow-y-auto">
        <h2 class="text-2xl mb-2">Sell</h2>
        <Show when={trades() && store.user} fallback={<Loading />}>
          <For each={trades().filter((t) => t.BuyerId === '')}>
            {(trade) => (
              <TradeCard
                trade={trade}
                complete={tradeCallback}
                disabled={trade.Price > store.user!.Balance}
              />
            )}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-2 row-span-2 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
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
