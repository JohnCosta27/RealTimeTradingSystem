import { Navigate, Outlet } from '@solidjs/router';
import { Component, createResource, Show, Suspense } from 'solid-js';
import { getNewAccess } from '@network';
import { StoreContextProvider } from '@state';

export const ProtectedRoute: Component = () => {
  const [isAuth] = createResource(getNewAccess);

  return (
    <Suspense fallback={<p>Loading</p>}>
      <Show
        when={isAuth() !== undefined}
        fallback={isAuth.state === 'ready' && <Navigate href="/auth/login" />}
      >
        <StoreContextProvider>
          <Outlet />
        </StoreContextProvider>
      </Show>
    </Suspense>
  );
};
