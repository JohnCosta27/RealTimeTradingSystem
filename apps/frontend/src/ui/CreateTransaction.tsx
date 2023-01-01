import { createMutation } from "@tanstack/solid-query";
import { Component, createSignal, For, Match, Switch } from "solid-js";
import { useAuth } from "../auth/AuthProvider";
import {
  GetAssets,
  GetUserAssets,
  PostCreateTransaction,
} from "../network/requests";

interface CreateTransactionProps {
  assets: GetUserAssets[];
  allAssets: GetAssets[];
}

export const CreateTransaction: Component<CreateTransactionProps> = (props) => {
  const auth = useAuth();

  const [sellAsset, setSellAsset] = createSignal("");
  const [sellAmount, setSellAmount] = createSignal(0);
  const [sellPrice, setSellPrice] = createSignal(0);
  const [type, setType] = createSignal<"buy" | "sell">("sell");

  const sell = createMutation({
    mutationFn: PostCreateTransaction,
    onSuccess: (res) => console.log(res),
  });

  return (
    <div class="grid-span-1 flex flex-col gap-4">
      <div class="flex gap-4">
        <p class="text-xl">Buy</p>
        <input
          type="checkbox"
          class="toggle toggle-secondary"
          checked={type() === "sell"}
          onChange={() =>
            type() === "sell" ? setType("buy") : setType("sell")
          }
        />
        <p class="text-xl">Sell</p>
      </div>
      <div class="dropdown">
        <label tabindex="0" class="btn m-1">
          Asset
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <Switch>
            <Match when={type() === "sell"}>
              <For each={props.assets}>
                {(asset) => (
                  <li onClick={() => setSellAsset(asset.Asset.Id)}>
                    <p>{asset.Asset.Name}</p>
                  </li>
                )}
              </For>
            </Match>
            <Match when={type() === "buy"}>
              <For each={props.allAssets}>
                {(asset) => (
                  <li onClick={() => setSellAsset(asset.Id)}>
                    <p>{asset.Name}</p>
                  </li>
                )}
              </For>
            </Match>
          </Switch>
        </ul>
      </div>
      <p>Selected Asset: {sellAsset()}</p>
      <p>
        Max Sell Amount:{" "}
        {props.assets.find((i) => i.Asset.Id === sellAsset())?.Amount}
      </p>
      <label class="label">
        <span class="label-text">Amount</span>
      </label>
      <input
        type="number"
        placeholder="Amount..."
        class="input input-secondary input-bordered w-full"
        onChange={(e) => setSellAmount(parseFloat(e.currentTarget.value))}
      />
      <label class="label">
        <span class="label-text">Price</span>
      </label>
      <input
        type="number"
        placeholder="Price..."
        class="input input-secondary input-bordered w-full"
        onChange={(e) => setSellPrice(parseFloat(e.currentTarget.value))}
      />
      <button
        class="btn btn-secondary"
        onClick={() =>
          sell.mutate({
            access: auth().access || "",
            transactionBody: {
              assetId: sellAsset(),
              type: type(),
              Price: sellPrice(),
              Amount: sellAmount(),
            },
          })
        }
      >
        Click to sell!
      </button>
    </div>
  );
};
