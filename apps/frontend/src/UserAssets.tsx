import { createQuery } from "@tanstack/solid-query";
import { Component, For, Match, Switch } from "solid-js";
import { useAuth } from "./auth/AuthProvider";
import { GetUserAssets } from "./network/requests";
import { Asset } from "./ui/Asset";
import { Loading } from "./ui/Loading";

export const UserAssets: Component = () => {
  const auth = useAuth();

  const userAssets = createQuery(
    () => ["userAssets"],
    () => GetUserAssets(auth().access).then((res) => res.data)
  );

  return (
    <div class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg">
      <h2 class="text-4xl">My Assets</h2>
      <Switch>
        <Match when={userAssets.isLoading}>
          <Loading />
        </Match>
        <Match when={userAssets.data !== undefined}>
          <For each={userAssets.data!.assets}>
            {(asset) => (
              <Asset id={asset.Asset.Id} name={asset.Asset.Name} amount={asset.Amount} price={20} />
            )}
          </For>
        </Match>
      </Switch>
    </div>
  )
}
