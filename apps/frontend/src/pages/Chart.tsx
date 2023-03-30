import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Component, Show } from 'solid-js';
import { GetAssetTrades, Requests } from '@network';
import { Loading, AssetChart } from '@ui';

/**
 * Charts the price of a specific asset over time.
 */
export const ChartPage: Component = () => {
  const params = useParams();

  const allTradesAsset = createQuery(
    () => [Requests.AssetTrades + params.id],
    () =>
      GetAssetTrades({
        assetId: params.id,
      }).then((res) => res.data),
  );

  return (
    <div class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg">
      <Show when={allTradesAsset.data} fallback={<Loading />}>
        <AssetChart
          info={allTradesAsset.data!.trades.map((t) => [
            t.Price / t.Amount,
            t.UpdatedAt,
          ])}
        />
      </Show>
    </div>
  );
};
