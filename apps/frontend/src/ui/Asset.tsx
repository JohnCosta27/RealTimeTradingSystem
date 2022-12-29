import { Component, createSignal, Show } from "solid-js";

export interface AssetProps {
  name: string;
  amount?: number;
  price: number;
}

export const Asset: Component<AssetProps> = (props) => {
  const [price, setPrice] = createSignal(`--value:${props.price}`);

  return (
    <div class="w-full min-h-16 rounded shadow-lg bg-base-100 py-2 px-4 text-xl flex items-center gap-4 justify-between">
      <div class="flex flex-col gap-2">
        {props.name}
        <Show when={props.amount}>
          <p>Amount: {props.amount}</p>
        </Show>
      </div>
      <span class="countdown text-2xl">
        $<span style={price()}></span>
      </span>
    </div>
  );
};
