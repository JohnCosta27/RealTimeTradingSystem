import { createMutation, createQuery } from "@tanstack/solid-query";
import { Component, createEffect, For, Match, Show, Switch } from "solid-js";
import { useAuth } from "./auth/AuthProvider";
import {
  GetAllTrades,
  GetAssets,
  GetUserAssets,
  PostCompleteTransaction,
} from "./network/requests";
import { CreateTransaction } from "./ui/CreateTransaction";
import { Loading } from "./ui/Loading";

export const Trades: Component = () => {
  const auth = useAuth();

  const assets = createQuery(
    () => ["assets"],
    () => GetAssets(auth().access).then((res) => res.data)
  );

  const userAssets = createQuery(
    () => ["userAssets"],
    () => GetUserAssets(auth().access).then((res) => res.data)
  );

  const allTrades = createQuery(
    () => ["all-trades"],
    () => GetAllTrades(auth().access).then((res) => res.data)
  );

  const completeTrade = createMutation({
    mutationFn: PostCompleteTransaction,
    onSuccess: (res) => console.log(res),
  });

  return (
    <div class="w-full h-full p-4 grid grid-cols-2 gap-4">
      <div class="w-full col-span-1 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <h2 class="text-2xl">Buy</h2>
        <Show when={allTrades.data} fallback={<Loading />}>
          <For each={allTrades.data!.trades.filter((t) => t.SellerId === "")}>
            {(trade) => (
              <div>
                <p>Amount: {trade.Amount}</p>
                <p>Price: {trade.Price}</p>
                <p>Asset: {trade.AssetId}</p>
                <p>Buyer: {trade.BuyerId}</p>
              </div>
            )}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-1 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <h2 class="text-2xl">Sell</h2>
        <Show when={allTrades.data} fallback={<Loading />}>
          <For each={allTrades.data!.trades.filter((t) => t.BuyerId === "")}>
            {(trade) => (
              <div class="py-4">
                <p>Amount: {trade.Amount}</p>
                <p>Price: {trade.Price}</p>
                <p>Asset: {trade.AssetId}</p>
                <p>Seller: {trade.SellerId}</p>
                <button
                  class="btn"
                  onClick={() =>
                    completeTrade.mutate({
                      access: auth().access || "",
                      body: {
                        TransactionId: trade.Id,
                      },
                    })
                  }
                >
                  Buy
                </button>
              </div>
            )}
          </For>
        </Show>
      </div>
      <div class="w-full col-span-2 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <h2 class="text-2xl">Create Trade</h2>
        <Show when={userAssets.data} fallback={<Loading />}>
          <CreateTransaction assets={userAssets.data!.assets} />
        </Show>
      </div>
    </div>
  );
};
