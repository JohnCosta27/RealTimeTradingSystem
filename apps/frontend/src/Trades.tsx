import { createQuery } from "@tanstack/solid-query";
import { Component, createEffect } from "solid-js";
import { useAuth } from "./auth/AuthProvider";
import { GetAllTrades, GetUserAssets } from "./network/requests";

export const Trades: Component = () => {
  const auth = useAuth();

  const allTrades = createQuery(
    () => ["all-trades"],
    () => GetAllTrades(auth().access).then((res) => res.data)
  );

  const userAssets = createQuery(
    () => ["userAssets"],
    () => GetUserAssets(auth().access).then((res) => res.data)
  );

  createEffect(() => {
    console.log(allTrades.data);
    console.log(userAssets.data);
  });

  return (
    <div class="w-full h-full p-4 grid grid-cols-2 gap-4">
      <div class="w-full col-span-1 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <h2 class="text-2xl">Buy</h2>
      </div>
      <div class="w-full col-span-1 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <h2 class="text-2xl">Sell</h2>
      </div>
      <div class="w-full col-span-2 bg-neutral-focus rounded shadow-lg flex flex-col p-4">
        <h2 class="text-2xl">Create Trade</h2>
      </div>
    </div>
  )
}
