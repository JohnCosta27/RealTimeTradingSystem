import { Navigate, Outlet } from "@solidjs/router";
import { Component, Show } from "solid-js";

export const ProtectedRoute: Component = () => {
  return (
    <Show when={true} fallback={<Navigate href="/auth/login" />}>
      <Outlet />
    </Show>
  );
};
