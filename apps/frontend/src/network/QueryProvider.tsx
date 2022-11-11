import { Component, JSX } from "solid-js";
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const queryClient = new QueryClient();
export const QueryProvider: Component<{children: JSX.Element}> = (props) => {

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
