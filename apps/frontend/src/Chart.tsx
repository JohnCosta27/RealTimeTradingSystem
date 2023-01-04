import Chart from 'chart.js/auto';
import { Component, onMount } from 'solid-js';

export const ChartPage: Component = () => {
  onMount(() => {
    const ctx = document.getElementById('asset_canvas') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['a', 'b', 'c', 'd', 'e', 'f'],
        datasets: [
          {
            label: 'Price of asset',
            data: [12, 19, 21, 19, 15, 17],
            borderWidth: 1,
            tension: 0.1,
          },
        ],
      },
    });
  });

  return (
    <div class="w-full h-full p-4 flex flex-col gap-4 bg-neutral-focus rounded shadow-lg">
      <canvas width={1000} height={600} id="asset_canvas" />
    </div>
  );
};
