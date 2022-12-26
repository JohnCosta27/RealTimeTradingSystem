import { Component } from "solid-js";

export interface AssetProps {
  name: string;
}

export const Asset: Component<AssetProps> = (props) => {
  const price = `--value:${20}`;
  return (
    <div class="w-full h-16 rounded shadow-lg bg-base-100 py-2 px-4 text-xl flex items-center gap-4 justify-between">
      {props.name}
      <span class="countdown text-2xl">
        $<span style={price}></span>
      </span>
    </div>
  );
};
