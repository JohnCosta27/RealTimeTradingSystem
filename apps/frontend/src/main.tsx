import { Component } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router, Routes } from '@solidjs/router';
import { ProtectedRoute, AuthLayout, Login, Register } from '@auth';
import { Assets, Trades, UserAssets, ChartPage, FrontLayout } from '@pages';
import { WebSocketComponent, QueryProvider } from '@network';
import './index.css';
import { StoreContextProvider } from './state/store';

export const Main: Component = () => {
  return (
    <QueryProvider>
      <WebSocketComponent>
        <Router>
          <Routes>
            <Route path="/" component={ProtectedRoute}>
              <Route path="/" component={FrontLayout}>
                <Route path="/" component={StoreContextProvider}>
                  <Route path="/" component={Assets} />
                  <Route path="/assets" component={UserAssets} />
                  <Route path="/trades" component={Trades} />
                  <Route path="/assets/:id" component={ChartPage} />
                </Route>
              </Route>
            </Route>
            <Route path="/auth" component={AuthLayout}>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </Route>
          </Routes>
        </Router>
      </WebSocketComponent>
    </QueryProvider>
  );
};

render(() => <Main />, document.getElementById('root') as HTMLElement);
