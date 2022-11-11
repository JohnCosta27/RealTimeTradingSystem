import { useNavigate } from "@solidjs/router";
import { Component, createEffect, createSignal } from "solid-js";
import { useAuth } from "./AuthProvider";

export const Register: Component = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (auth().isAuth) {
      navigate("/");
    }
  });

  const [firstname, setFirstname] = createSignal("");
  const [surname, setSurname] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

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
          auth().methods.register({
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
