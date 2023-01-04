import { Component, Show } from 'solid-js';
import { GetTransaction } from '../network/requests';

export interface TradeCardProps {
  trade: GetTransaction;
  complete: (transactionId: string) => void;
}

export const TradeCard: Component<TradeCardProps> = (props) => {
  return (
    <div class="w-full p-2 rounded shadow-md bg-neutral grid gap-2 grid-cols-2">
      <div class="flex gap-2 flex-col col-span-1">
        <p>Amount: {props.trade.Amount}</p>
        <p>Price: {props.trade.Price}</p>
      </div>
      <div class="col-span-1 w-full flex justify-end">
        <p class="text-end text-2xl p-4 w-min rounded-xl text-accent-focus">
          ${Math.floor((props.trade.Amount / props.trade.Price) * 100) / 100}
        </p>
      </div>
      <button
        class="btn btn-secondary hover:btn-accent col-span-2"
        onClick={() => props.complete(props.trade.Id)}
      >
        <Show when={props.trade.BuyerId === ''} fallback={<>Sell</>}>
          Buy
        </Show>
      </button>
    </div>
  );
};