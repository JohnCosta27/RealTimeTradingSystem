import { Outlet, Link } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Component, Show } from 'solid-js';
import { GetUser } from '../network/requests';
import { Requests } from '../types';

export const FrontLayout: Component = () => {
  const allTrades = createQuery(
    () => [Requests.User],
    () => GetUser().then((res) => res.data),
  );

  return (
    <div class="w-full h-screen bg-base-100 flex">
      <div
        class="w-48 h-full bg-neutral-focus flex flex-col gap-2 cursor-pointer py-8 px-4 text-2xl"
        data-testid="sidebar"
      >
        <Link href="/">
          <div class="w-full hover:bg-primary flex items-center transition-all p-2 rounded">
            Home
          </div>
        </Link>
        <Link href="/assets">
          <div class="w-full hover:bg-primary flex items-center transition-all p-2 rounded">
            My Assets
          </div>
        </Link>
        <Link href="/trades">
          <div class="w-full hover:bg-primary flex items-center transition-all p-2 rounded">
            Trades
          </div>
        </Link>
        <Show when={allTrades.data}>
          <div class="mt-auto">Balance: ${allTrades.data!.user.Balance}</div>
        </Show>
      </div>
      <div class="w-full p-4 flex justify-center overflow-y-auto">
        <div class="w-full max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
