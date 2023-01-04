import { Component, onMount } from "solid-js";
import Chart from 'chart.js/auto';

interface AssetChartProps {
  prices: number[];
}

export const AssetChart: Component<AssetChartProps> = (props) => {

  onMount(() => {
    const ctx = document.getElementById('asset_canvas') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array(props.prices.length).fill("bruh"),
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

  return (
      <canvas width={1000} height={600} id="asset_canvas" />
  );
}
