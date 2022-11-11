import { Component } from "solid-js";
import { Route, Router, Routes } from "@solidjs/router";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import { render } from "solid-js/web";
import { QueryProvider } from "./network/QueryProvider";
import { App } from "./App";
import "./index.css";
import { AuthLayout } from "./auth/AuthLayout";
import { Login } from "./auth/Login";

export const Main: Component = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" component={ProtectedRoute}>
              <Route path="/" component={App} />
            </Route>
            <Route path="/auth" component={AuthLayout}>
              <Route path="/login" component={Login} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
};

render(() => <Main />, document.getElementById("root") as HTMLElement);
