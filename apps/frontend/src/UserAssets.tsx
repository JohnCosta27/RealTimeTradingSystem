import { Component, For, Match, Switch } from "solid-js";
import { useStore } from "./state";
import { Asset } from "./ui/Asset";
import { Loading } from "./ui/Loading";

export const UserAssets: Component = () => {
  const { store } = useStore();

  return (
    <div class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg">
      <h2 class="text-4xl">My Assets</h2>
      <Switch>
        <Match when={store.userAssets === undefined}>
          <Loading />
        </Match>
        <Match when={store.userAssets !== undefined}>
          <For each={store.userAssets!.filter(a => a.Amount > 0)}>
            {(asset) => (
              <Asset id={asset.Asset.Id} name={asset.Asset.Name} amount={asset.Amount} price={20} />
            )}
          </For>
        </Match>
      </Switch>
    </div>
  )
}
