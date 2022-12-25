import { createQuery } from "@tanstack/solid-query";
import { Component, For, Match, Show, Switch } from "solid-js";
import { useAuth } from "./auth/AuthProvider";
import { GetAllTrades, GetAssets, GetUserAssets } from "./network/requests";
import { CreateTransaction } from "./ui/CreateTransaction";

// Main page of the application
export const App: Component = () => {
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

  return (
    <div class="w-full h-screen bg-base-100 grid grid-cols-3 gap-4 p-4">
      <div class="grid-span-1 flex flex-col gap-4 border-2 border-secondary p-4">
        <Switch>
          <Match when={assets.isLoading}>
            <p>Loading...</p>
          </Match>
          <Match when={assets.data !== undefined}>
            <For each={assets.data!.assets}>
              {(asset) => (
                <div class="w-full rounded bg-neutral flex flex-col text-xl text-gray-300 p-4">
                  <p>{asset.Name}</p>
                </div>
              )}
            </For>
          </Match>
        </Switch>
      </div>
      <div class="grid-span-1 flex flex-col gap-4 border-2 border-secondary p-4">
        <Switch>
          <Match when={userAssets.isLoading}>
            <p>Loading...</p>
          </Match>
          <Match when={userAssets.data !== undefined}>
            <For each={userAssets.data!.assets}>
              {(asset) => (
                <div class="w-full rounded bg-neutral flex flex-col text-xl text-gray-300 p-4">
                  <p>{asset.Amount}</p>
                  <p>{asset.Asset.Name}</p>
                </div>
              )}
            </For>
          </Match>
        </Switch>
      </div>
      <Show when={userAssets.data !== undefined} fallback={<p>Loading</p>}>
        <CreateTransaction assets={userAssets.data!.assets} />
      </Show>
    </div>
  );
};
