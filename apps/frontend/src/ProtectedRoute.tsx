import { Navigate, Outlet } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { useAuth } from "./auth/AuthProvider";

export const ProtectedRoute: Component = () => {
  const auth = useAuth();

  return (
    <Show when={auth().isAuth} fallback={<Navigate href="/auth/login" />}>
      <Outlet />
    </Show>
  );
};
