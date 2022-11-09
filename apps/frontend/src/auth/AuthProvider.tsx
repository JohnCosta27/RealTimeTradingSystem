import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createSignal,
  JSX,
  Match,
  Switch,
  useContext,
} from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { PostLogin, PostRefresh, PostRegister } from "../network/requests";

interface AuthContextType {
  refresh?: string;
  access?: string;
  isAuth: boolean;
}

const AuthContext = createContext<Accessor<AuthContextType>>();
export const useAuth = () => useContext(AuthContext);

const GetAuth = (): AuthContextType => {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (access && refresh) {
    return {
      isAuth: true,
      access,
      refresh,
    };
  } else {
    return {
      isAuth: false,
    };
  }
};

export const AuthProvider: Component<{ children: JSX.Element }> = (props) => {
  const [auth, setAuth] = createSignal<AuthContextType>(GetAuth());

  const register = createMutation({
    mutationFn: PostRegister,
    onSuccess: (res) => {
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("access", res.data.access);

      setAuth(() => ({
        refresh: res.data.refresh,
        access: res.data.access,
        isAuth: true,
      }));
    },
  });

  const login = createMutation({
    mutationFn: PostLogin,
    onSuccess: (res) => {
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("access", res.data.access);

      setAuth(() => ({
        refresh: res.data.refresh,
        access: res.data.access,
        isAuth: true,
      }));
    },
  });

  const refresh = createMutation({
    mutationFn: PostRefresh,
    onSuccess: (res) => {
      localStorage.setItem("access", res.data.access);

      setAuth((prev) => ({
        refresh: prev.refresh,
        access: res.data.access,
        isAuth: true,
      }));
    },
  });

  return (
    <AuthContext.Provider value={auth}>
      <Switch>
        <Match when={auth().isAuth}>
          <>
            <button
              onClick={() => {
                refresh.mutate({
                  refresh: auth().refresh || "",
                });
              }}
            >
              Click to refresh
            </button>
            {props.children}
          </>
        </Match>
        <Match when={!auth().isAuth}>
          <button
            onClick={() => {
              register.mutate({
                firstname: "Solid",
                surname: "Js",
                email: `solid@js.com`,
                password: "hello",
              });
            }}
          >
            Click to test register
          </button>
          <button
            onClick={() => {
              login.mutate({
                email: `solid@js.com`,
                password: "hello",
              });
            }}
          >
            Click to test login
          </button>
        </Match>
      </Switch>
    </AuthContext.Provider>
  );
};
