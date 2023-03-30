import { Component, For, Show } from 'solid-js';
import { useStore } from '@state';
import { Asset, Loading } from '@ui';

/**
 * Displays the asset the user owns.
 */
export const UserAssets: Component = () => {
  const { store } = useStore();

  return (
    <div class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg">
      <h2 class="text-4xl">My Assets</h2>
      <Show when={store.userAssets} fallback={<Loading />}>
        <For each={store.userAssets!.filter((a) => a.Amount > 0)}>
          {(asset) => (
            <Asset
              id={asset.Asset.Id}
              name={asset.Asset.Name}
              amount={asset.Amount}
            />
          )}
        </For>
      </Show>
    </div>
  );
};
