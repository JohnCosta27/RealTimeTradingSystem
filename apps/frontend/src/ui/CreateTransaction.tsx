import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { Component, createSignal, For, Match, Show, Switch } from 'solid-js';
import {
  GetAssets,
  GetUserAssets,
  PostCreateTransaction,
} from '@network';

interface CreateTransactionProps {
  assets: GetUserAssets[];
  allAssets: GetAssets[];
}

export const CreateTransaction: Component<CreateTransactionProps> = (props) => {
  const query = useQueryClient();

  const [sellAsset, setSellAsset] = createSignal<GetAssets>();
  const [sellAmount, setSellAmount] = createSignal(0);
  const [sellPrice, setSellPrice] = createSignal(0);
  const [type, setType] = createSignal<'buy' | 'sell'>('sell');

  const sell = createMutation({
    mutationFn: PostCreateTransaction,
    onSuccess: () => {
      query.invalidateQueries();
    },
  });

  return (
    <div class="w-full h-full grid grid-cols-2 gap-2">
      <div class="w-full flex flex-col min-h-[30vh]">
        <div class="flex items-center justify-center gap-4">
          <p class="text-3xl">Buy</p>
          <input
            type="checkbox"
            class="toggle toggle-secondary"
            checked={type() === 'sell'}
            onChange={() =>
              type() === 'sell' ? setType('buy') : setType('sell')
            }
          />
          <p class="text-3xl">Sell</p>
        </div>
        <label class="label">
          <span class="label-text">Amount</span>
        </label>
        <input
          type="number"
          placeholder="69"
          class="input input-secondary input-bordered w-full"
          aria-roledescription='trade-amount'
          onChange={(e) => setSellAmount(parseFloat(e.currentTarget.value))}
        />
        <label class="label">
          <span class="label-text">Price</span>
        </label>
        <input
          type="number"
          placeholder="420"
          class="input input-secondary input-bordered w-full"
          aria-roledescription='trade-price'
          onChange={(e) => setSellPrice(parseFloat(e.currentTarget.value))}
        />
        <div class="flex flex-col mt-auto">
          <button
            class="btn btn-secondary"
            aria-roledescription="create-trade"
            onClick={() =>
              sell.mutate({
                assetId: sellAsset()!.Id,
                type: type(),
                Price: sellPrice(),
                Amount: sellAmount(),
              })
            }
          >
            <Show when={type() === 'buy'} fallback={<>Sell</>}>
              Buy
            </Show>
          </button>
        </div>
      </div>
      <div class="w-full flex flex-col gap-4">
        <div class="dropdown w-full">
          <label tabindex="0" class="btn m-1 w-full hover:bg-accent-focus">
            <Show when={sellAsset()?.Name} fallback={<>Select Asset</>}>
              {sellAsset()!.Name}
            </Show>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full"
          >
            <Switch>
              <Match when={type() === 'sell'}>
                <For each={props.assets}>
                  {(asset) => (
                    <li onClick={() => setSellAsset(asset.Asset)}>
                      <p>{asset.Asset.Name}</p>
                    </li>
                  )}
                </For>
              </Match>
              <Match when={type() === 'buy'}>
                <For each={props.allAssets}>
                  {(asset) => (
                    <li onClick={() => setSellAsset(asset)}>
                      <p>{asset.Name}</p>
                    </li>
                  )}
                </For>
              </Match>
            </Switch>
          </ul>
        </div>
      </div>
    </div>
  );
};
