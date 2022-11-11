import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

export const AuthLayout: Component = () => {
  return (
    <div class="w-full h-screen grid place-items-center bg-gray-100">
      <div class="w-96 h-96 bg-white rounded shadow-lg flex flex-col gap-4 items-center p-4">
        <Outlet />
      </div>
    </div>
  );
};
