import { createMutation } from "@tanstack/solid-query";
import { Component, createSignal, For } from "solid-js";
import { useAuth } from "../auth/AuthProvider";
import { GetUserAssets, PostCreateTransaction } from "../network/requests";

interface CreateTransactionProps {
  assets: GetUserAssets[];
}

export const CreateTransaction: Component<CreateTransactionProps> = (props) => {
  const auth = useAuth();

  const [sellAsset, setSellAsset] = createSignal("");
  const [sellAmount, setSellAmount] = createSignal(0);
  const [sellPrice, setSellPrice] = createSignal(0);

  const sell = createMutation({
    mutationFn: PostCreateTransaction,
    onSuccess: (res) => console.log(res),
  });

  return (
    <div class="grid-span-1 flex flex-col gap-4">
      <div class="dropdown">
        <label tabindex="0" class="btn m-1">
          Asset
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <For each={props.assets}>
            {(asset) => (
              <li onClick={() => setSellAsset(asset.Asset.Id)}>
                <p>{asset.Asset.Name}</p>
              </li>
            )}
          </For>
        </ul>
      </div>
      <p>Selected Asset: {sellAsset()}</p>
      <p>Max Sell Amount: {props.assets.find(i => i.Asset.Id === sellAsset())?.Amount}</p>
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
      <button class="btn btn-secondary" onClick={() => sell.mutate({
        access: auth().access || "",
        transactionBody: {
          assetId: sellAsset(),
          type: 'sell',
          Price: sellPrice(),
          Amount: sellAmount(),
        }
      })}>Click to sell!</button>
    </div>
  );
};
