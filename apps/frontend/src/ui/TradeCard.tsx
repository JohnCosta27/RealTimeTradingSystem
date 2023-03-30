import clsx from 'clsx';
import { Component, Show } from 'solid-js';
import { GetAssets, GetTransaction } from '@network';
import { useUserId } from '@auth';

export interface TradeCardProps {
  trade: GetTransaction;
  asset?: GetAssets;
  complete: (transactionId: string) => void;
  disabled?: boolean;
}

export const TradeCard: Component<TradeCardProps> = (props) => {
  const userId = useUserId();

  const isUsersTrade =
    props.trade.SellerId === userId || props.trade.BuyerId === userId;

  return (
    <div
      class={clsx(
        'w-full p-2 rounded shadow-md bg-neutral grid gap-2 grid-cols-2',
        isUsersTrade && 'border-2 border-secondary',
      )}
    >
      <div class="flex gap-2 flex-col col-span-1">
        <Show when={props.asset}>
          <p class="text-2xl">{props.asset!.Name}</p>
        </Show>
        <p>Amount: {props.trade.Amount}</p>
        <p>Price: {props.trade.Price}</p>
      </div>
      <div class="col-span-1 w-full flex justify-end">
        <p class="text-end text-2xl p-4 w-min rounded-xl text-accent-focus">
          ${Math.floor((props.trade.Price / props.trade.Amount) * 100) / 100}
        </p>
      </div>
      <Show when={!isUsersTrade}>
        <button
          class={clsx("btn btn-secondary hover:btn-accent col-span-2", props.disabled && "btn-disabled")}
          onClick={
            props.disabled ? () => {} : () => props.complete(props.trade.Id)
          }
        >
          <Show when={props.trade.BuyerId === ''} fallback={<>Sell</>}>
            Buy
          </Show>
        </button>
      </Show>
    </div>
  );
};
