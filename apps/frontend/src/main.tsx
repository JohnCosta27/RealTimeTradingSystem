import { Component } from 'solid-js';
import { Route, Router, Routes } from '@solidjs/router';
import { ProtectedRoute } from './ProtectedRoute';
import { render } from 'solid-js/web';
import { QueryProvider } from './network/QueryProvider';
import './index.css';
/*
import { AuthLayout } from './auth/AuthLayout';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
*/
import { FrontLayout } from './pages/FrontLayout';
import { Assets } from './Assets';
import { Trades } from './Trades';
import { UserAssets } from './UserAssets';
import { ChartPage } from './Chart';
import { WebSocketComponent } from './network/WebSocket';

export const Main: Component = () => {
  return (
    <QueryProvider>
      <WebSocketComponent>
          <Router>
            <Routes>
              <Route path="/" component={ProtectedRoute}>
                <Route path="/" component={FrontLayout}>
                  <Route path="/" component={Assets} />
                  <Route path="/assets" component={UserAssets} />
                  <Route path="/trades" component={Trades} />
                  <Route path="/assets/:id" component={ChartPage} />
                </Route>
              </Route>
            {
              /*
              <Route path="/auth" component={AuthLayout}>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
              </Route>
               */
            }
            </Routes>
          </Router>
      </WebSocketComponent>
    </QueryProvider>
  );
};

render(() => <Main />, document.getElementById('root') as HTMLElement);
