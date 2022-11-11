import { Component } from "solid-js";

export const Login: Component = () => {
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
        />
      </div>

      <button class="btn btn-primary w-full">Login</button>
    </>
  );
};
