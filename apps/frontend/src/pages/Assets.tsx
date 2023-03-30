import { Component, For, Show } from 'solid-js';
import { useStore } from '@state';
import { Asset, Loading } from '@ui';

/**
 * Displays the asset that the system supports.
 */
export const Assets: Component = () => {
  const { store } = useStore();

  return (
    <div
      class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg"
      data-testid="asset-page"
    >
      <h2 class="text-4xl">Assets</h2>
      <Show when={store.assets} fallback={<Loading />}>
        <For each={store.assets}>
          {(asset) => <Asset id={asset.Id} name={asset.Name} />}
        </For>
      </Show>
    </div>
  );
};
