import { Component, onCleanup, onMount } from "solid-js";
import Chart from 'chart.js/auto';
import { useParams } from "@solidjs/router";

interface AssetChartProps {
  prices: number[];
}

export const AssetChart: Component<AssetChartProps> = (props) => {
  const params = useParams<{id: string}>();

  let graph: Chart<'line'>;

  onMount(() => {
    const ctx = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;

    graph  = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(props.prices.length).fill("Price"),
        datasets: [
          {
            label: 'Price of asset',
            data: props.prices,
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
  })

  return (
      <canvas width={1000} height={600} id={params.id} />
  );
}
