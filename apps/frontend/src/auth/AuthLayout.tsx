import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

/**
 * A simple UI layout, that centers the login/register boxes
 * Renders the `Outlet`, which is the routers child route.
 */
export const AuthLayout: Component = () => {
  return (
    <div class="w-full h-screen grid place-items-center bg-gray-100">
      <div class="w-96 min-h-96 bg-white rounded shadow-lg flex flex-col gap-4 items-center p-4">
        <Outlet />
      </div>
    </div>
  );
};
