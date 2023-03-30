import { Outlet, Link } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { useStore } from '@state';

/**
 * A simple UI layout, that creates the sidebar and shows the users balance.
 * and also renders the applications page in the center of the screen. 
 * Renders the `Outlet`, which is the routers child route.
 */
export const FrontLayout: Component = () => {
  const { store } = useStore();

  return (
    <div class="w-full h-screen bg-base-100 flex">
      <div
        class="w-48 h-full bg-neutral-focus flex flex-col gap-2 cursor-pointer py-8 px-4 text-2xl"
        data-testid="sidebar"
      >
        <Link href="/">
          <div
            class="w-full hover:bg-primary flex items-center transition-all p-2 rounded"
            aria-roledescription="goto-home"
          >
            Home
          </div>
        </Link>
        <Link href="/assets">
          <div
            class="w-full hover:bg-primary flex items-center transition-all p-2 rounded"
            aria-roledescription="goto-my-assets"
          >
            My Assets
          </div>
        </Link>
        <Link href="/trades">
          <div
            class="w-full hover:bg-primary flex items-center transition-all p-2 rounded"
            aria-roledescription="goto-trades"
          >
            Trades
          </div>
        </Link>
        <Show when={store.user}>
          <div class="mt-auto">Balance: ${store.user!.Balance}</div>
        </Show>
      </div>
      <div class="w-full p-4 flex justify-center overflow-y-auto">
        <div class="w-full max-w-[80vw]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
