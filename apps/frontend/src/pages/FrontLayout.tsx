import { Outlet, Link } from "@solidjs/router";
import { Component } from "solid-js";

export const FrontLayout: Component = () => {
  return (
    <div class="w-full h-screen bg-base-100 flex">
      <div class="w-48 h-full bg-neutral-focus flex flex-col gap-2 cursor-pointer py-8 px-4 text-2xl">
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
      </div>
      <div class="w-full p-4 flex justify-center">
        <div class="w-full max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
