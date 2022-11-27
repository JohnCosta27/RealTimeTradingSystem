import {
  Accessor,
  Component,
  createContext,
  createSignal,
  JSX,
  useContext,
} from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import {
  PostLogin,
  PostLoginType,
  PostRefresh,
  PostRefreshType,
  PostRegister,
  PostRegisterType,
} from "../network/requests";

interface AuthMethods {
  register: (vars: PostRegisterType) => void;
  login: (vars: PostLoginType) => void;
  refreshRes: (vars: PostRefreshType) => void;
}

interface AuthContextType {
  refresh?: string;
  access?: string;
  isAuth: boolean;
  methods: AuthMethods;
}

const initState: AuthContextType = {
  isAuth: false,
  methods: {
    register: () => {},
    login: () => {},
    refreshRes: () => {},
  },
};

const AuthContext = createContext<Accessor<AuthContextType>>(() => initState);
export const useAuth = () => useContext(AuthContext);

const GetAuth = (methods: AuthMethods): AuthContextType => {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (access && refresh) {
    return {
      isAuth: true,
      access,
      refresh,
      methods,
    };
  } else {
    return {
      isAuth: false,
      methods,
    };
  }
};

export const AuthProvider: Component<{ children: JSX.Element }> = (props) => {
  const register = createMutation({
    mutationFn: PostRegister,
    onSuccess: (res) => {
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("access", res.data.access);

      setAuth((prev) => ({
        ...prev,
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

      setAuth((prev) => ({
        ...prev,
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
        ...prev,
        access: res.data.access,
        isAuth: true,
      }));
    },
  });

  const [auth, setAuth] = createSignal<AuthContextType>(
    GetAuth({
      register: register.mutate,
      login: login.mutate,
      refreshRes: refresh.mutate,
    })
  );

  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
};