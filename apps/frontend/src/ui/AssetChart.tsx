import { Component, onCleanup, onMount } from 'solid-js';
import Chart from 'chart.js/auto';
import { useParams } from '@solidjs/router';

interface AssetChartProps {
  /** A tuple, where the first item is the price, and the second the time. */
  info: [number, string][];
}

// Creates a ChartJS chart and plots the information on it.
export const AssetChart: Component<AssetChartProps> = (props) => {
  const params = useParams<{ id: string }>();

  let graph: Chart<'line'>;

  onMount(() => {
    const ctx = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;

    graph = new Chart(ctx, {
      type: 'line',
      data: {
        labels: props.info.map(([_price, time]) =>
          new Date(time).toISOString(),
        ),
        datasets: [
          {
            label: 'Price of asset',
            data: props.info.map(([price]) => price),
            borderWidth: 1,
            tension: 0.1,
          },
        ],
      },
    });
  });

  onCleanup(() => {
    if (graph) {
      graph.destroy();
    }
  });

  return <canvas width={1000} height={600} id={params.id} />;
};
