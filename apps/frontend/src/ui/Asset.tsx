import { useNavigate } from '@solidjs/router';
import { Component, createSignal, Show } from 'solid-js';

export interface AssetProps {
  id: string;
  name: string;
  amount?: number;
  price: number;
}

export const Asset: Component<AssetProps> = (props) => {
  const [price] = createSignal(`--value:${props.price}`);
  const nav = useNavigate();

  return (
    <div
      aria-roledescription='asset-card'
      class="w-full min-h-16 rounded shadow-lg bg-base-100 py-2 px-4 text-xl flex items-center gap-4 justify-between"
    >
      <div class="flex flex-col gap-2">
        {props.name}
        <Show when={props.amount}>
          <p>Amount: {props.amount}</p>
        </Show>
      </div>
      <div class="flex gap-4 items-center">
        <button
          class="btn btn-accent"
          aria-roledescription='view-graph-button'
          onClick={() => nav(`/assets/${props.id}`)}
        >
          Graph
        </button>
        <span class="countdown text-2xl">
          $<span style={price()}></span>
        </span>
      </div>
    </div>
  );
};
