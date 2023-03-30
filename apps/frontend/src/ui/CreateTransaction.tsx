import { createMutation, useQueryClient } from '@tanstack/solid-query';
import {
  Component,
  createEffect,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from 'solid-js';
import { GetAssets, GetUserAssets, PostCreateTransaction } from '@network';

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

  const [error, setError] = createSignal(false);

  const getMessage = (): string => {
    if (!sellAsset()) {
      return 'You need to select an asset';
    }
    if (sellAmount() === 0) {
      return `You need to select an amount you want to ${type()}`;
    }
    if (sellPrice() === 0) {
      return `You need to select a price`;
    }
    return '';
  };

  const sell = createMutation({
    mutationFn: PostCreateTransaction,
    onSuccess: () => {
      query.invalidateQueries();
    },
  });

  const createTrade = () => {
    if (getMessage().length > 0) {
      setError(true);
      return;
    }
    sell.mutate({
      assetId: sellAsset()!.Id,
      type: type(),
      Price: sellPrice(),
      Amount: sellAmount(),
    });
  };

  return (
    <div class="w-full h-full flex flex-col gap-2">
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
        aria-roledescription="trade-amount"
        onFocus={() => setError(false)}
        onInput={(e) => setSellAmount(parseFloat(e.currentTarget.value))}
      />
      <label class="label">
        <span class="label-text">Price per item</span>
      </label>
      <input
        type="number"
        placeholder="420"
        class="input input-secondary input-bordered w-full"
        aria-roledescription="trade-price"
        onFocus={() => setError(false)}
        onInput={(e) => setSellPrice(parseFloat(e.currentTarget.value))}
      />
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
                  <li
                    onClick={() => {
                      setError(false);
                      setSellAsset(asset.Asset);
                    }}
                  >
                    <p>{asset.Asset.Name}</p>
                  </li>
                )}
              </For>
            </Match>
            <Match when={type() === 'buy'}>
              <For each={props.allAssets}>
                {(asset) => (
                  <li
                    onClick={() => {
                      setError(false);
                      setSellAsset(asset);
                    }}
                  >
                    <p>{asset.Name}</p>
                  </li>
                )}
              </For>
            </Match>
          </Switch>
        </ul>
      </div>
      <div class="flex flex-col text-2xl">
        <p>Total Price: ${sellAmount() * sellPrice()}</p>
      </div>
      <div class="flex flex-col mt-auto">
        <Show when={error()}>
          <p class="text-xl text-red-400 my-2 text-center">{getMessage()}</p>
        </Show>
        <button
          class="btn btn-secondary"
          aria-roledescription="create-trade"
          onClick={createTrade}
        >
          <Show when={type() === 'buy'} fallback={<>Sell</>}>
            Buy
          </Show>
        </button>
      </div>
    </div>
  );
};
