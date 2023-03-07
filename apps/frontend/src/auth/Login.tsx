import { useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { Component, createSignal } from "solid-js";
import { PostLogin } from "../network/requests";

export const Login: Component = () => {
  const nav = useNavigate();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const login = createMutation({
    mutationFn: PostLogin,
    onSuccess: (res) => {
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      nav('/');
    }
  })

  return (
    <>
      <h1 class="text-3xl">Login</h1>
      <div class="flex flex-col w-full">
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          class="input input-primary input-bordered w-full"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </div>

      <div class="flex flex-col w-full">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          class="input input-primary input-bordered w-full"
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>

      <button
        class="btn btn-primary w-full"
        onClick={() => login.mutate({
          email: email(),
          password: password(),
        })}
      >
        Login
      </button>
    </>
  );
};
