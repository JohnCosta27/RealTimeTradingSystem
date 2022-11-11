import { Outlet } from "@solidjs/router";
import { Component, Show } from "solid-js";
import { useAuth } from "./auth/AuthProvider";

export const ProtectedRoute: Component = () => {
  const auth = useAuth();

  return (
    <Show when={auth().isAuth} fallback={
      <button
        onClick={() =>
          auth().methods.login({ email: "solid@js.com", password: "hello" })
        }
      >login</button>
    }>
      <Outlet />
    </Show>
  );
};
