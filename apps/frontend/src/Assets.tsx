import { createQuery } from "@tanstack/solid-query";
import { Component, For, Match, Switch } from "solid-js";
import { useAuth } from "./auth/AuthProvider";
import { GetAssets }  from "./network/requests";
import { Asset } from "./ui/Asset";
import { Loading } from "./ui/Loading";

export const Assets: Component = () => {
  const auth = useAuth();

  const assets = createQuery(
    () => ["assets"],
    () => GetAssets(auth().access).then((res) => res.data)
  );

  return (
    <div class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg">
      <h2 class="text-4xl">Assets</h2>
      <Switch>
        <Match when={assets.isLoading}>
          <Loading />
        </Match>
        <Match when={assets.data}>
          <For each={assets.data!.assets}>
            {(asset) => <Asset name={asset.Name} />}
          </For>
        </Match>
      </Switch>
    </div>
  )
}
