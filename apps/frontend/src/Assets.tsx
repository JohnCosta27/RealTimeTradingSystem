import { createQuery } from '@tanstack/solid-query';
import { Component, For, Match, Switch } from 'solid-js';
import { GetAssets } from './network/requests';
import { Requests } from './types';
import { Asset } from './ui/Asset';
import { Loading } from './ui/Loading';

export const Assets: Component = () => {

  const assets = createQuery(
    () => [Requests.Assets],
    () => GetAssets().then((res) => res.data),
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
            {(asset) => <Asset id={asset.Id} name={asset.Name} price={10} />}
          </For>
        </Match>
      </Switch>
    </div>
  );
};
