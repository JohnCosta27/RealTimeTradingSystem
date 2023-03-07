import { Navigate, Outlet } from '@solidjs/router';
import { Component, createResource, Show, Suspense } from 'solid-js';
import { getNewAccess } from './network/requests';

export const ProtectedRoute: Component = () => {
  const [isAuth] = createResource(getNewAccess);

  return (
    <Suspense fallback={<p>Loading</p>}>
      <Show
        when={isAuth() !== undefined}
        fallback={isAuth.state === 'ready' && <Navigate href="/auth/login" />}
      >
        <Outlet />
      </Show>
    </Suspense>
  );
};
