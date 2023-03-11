import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { Component, createSignal } from 'solid-js';
import { PostRegister, setTokens } from '../network/requests';

export const Register: Component = () => {
  const nav = useNavigate();

  const [firstname, setFirstname] = createSignal('');
  const [surname, setSurname] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const register = createMutation({
    mutationFn: PostRegister,
    onSuccess: (res) => {
      setTokens(res.data.access, res.data.refresh);
      nav('/');
    },
  });

  return (
    <>
      <h1 class="text-3xl">Register</h1>

      <div class="flex flex-col w-full">
        <label class="label">
          <span class="label-text">Firstname</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          class="input input-primary input-bordered w-full"
          onChange={(e) => setFirstname(e.currentTarget.value)}
        />
      </div>

      <div class="flex flex-col w-full">
        <label class="label">
          <span class="label-text">Surname</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          class="input input-primary input-bordered w-full"
          onChange={(e) => setSurname(e.currentTarget.value)}
        />
      </div>

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
        onClick={() =>
          register.mutate({
            firstname: firstname(),
            surname: surname(),
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
