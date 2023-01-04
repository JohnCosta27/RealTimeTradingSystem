import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Component, Show } from 'solid-js';
import { AssetChart } from './AssetChart';
import { useAuth } from './auth/AuthProvider';
import { GetAllTrades } from './network/requests';
import { Requests } from './types';
import { Loading } from './ui/Loading';

export const ChartPage: Component = () => {
  const auth = useAuth();
  const params = useParams();

  const allTrades = createQuery(
    () => [Requests.AllTrades],
    () => GetAllTrades(auth().access).then((res) => res.data),
  );

  return (
    <div class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg">
      <Show when={allTrades.data} fallback={<Loading />}>
        <AssetChart
          prices={allTrades
            .data!.trades.filter((t) => t.AssetId === params.id)
            .map((t) => t.Price / t.Amount)}
        />
      </Show>
    </div>
  );
};
