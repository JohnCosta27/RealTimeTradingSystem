import { Navigate, Outlet } from '@solidjs/router';
import { Component, createResource, Show, Suspense } from 'solid-js';
import { getNewAccess } from '@network';

/**
 * ProtectedRoute isn't a UI component, but it does redirect the user
 * back to login, if it detects that they are not logged in.
 * The route is used to prevent the user from viewing parts of the application
 * that they shouldn't if they are not logged in.
 */
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
