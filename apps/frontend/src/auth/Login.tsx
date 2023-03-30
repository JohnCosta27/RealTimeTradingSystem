import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import clsx from 'clsx';
import { Component, createSignal, Show } from 'solid-js';
import { PostLogin, setTokens } from '@network';

/**
 * Login component, takes a user email and password and logs them in.
 * It redirects to '/' if successful, otherwise shows an error message.
 */
export const Login: Component = () => {
  const nav = useNavigate();

  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal(false);

  const disableError = () => setError(false);

  const login = createMutation({
    mutationFn: PostLogin,
    onSuccess: (res) => {
      setTokens(res.data.access, res.data.refresh);
      nav('/');
    },
    onError: () => {
      setError(true);
    },
  });

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
          onFocus={disableError}  
          class={clsx("input input-primary input-bordered w-full", error() && "border-red-500")}
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
          onFocus={disableError}  
          class={clsx("input input-primary input-bordered w-full", error() && "border-red-500")}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>

      <Show when={error()}>
        <p class="text-red-200">Email or password are incorrect</p>
      </Show>

      <button
        class={clsx("btn btn-primary w-full", error() && 'bg-red-500')}
        onClick={() =>
          login.mutate({
            email: email(),
            password: password(),
          })
        }
      >
        Login
      </button>
    </>
  );
};
