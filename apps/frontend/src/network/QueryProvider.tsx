import { Component, JSX } from "solid-js";
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnMount: false,
    }
  }  
});

/**
 * Should be rendered at the top of the application tree, because it
 * provides the state for the query library I am using. 
 */
export const QueryProvider: Component<{children: JSX.Element}> = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
