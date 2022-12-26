import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

export const FrontLayout: Component = () => {
  return (
    <div class="w-full h-screen bg-base-100 flex">
      <div class="w-32 h-full bg-neutral-focus"></div>
      <div class="w-full p-4 flex justify-center">
        <div class="w-full max-w-5xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
