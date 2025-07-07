import { Route, Routes } from 'react-router';
import { routes } from './consts/routes.ts';
import { Register } from './pages/Register.tsx';
import { Login } from './pages/Login.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { RouteProtector } from './RouteProtector.tsx';

export function Router() {
  return (
    <Routes>
      <Route element={<RouteProtector routeType="public" />}>
        <Route path={routes.register} element={<Register />} />
        <Route path={routes.login} element={<Login />} />
      </Route>
      <Route element={<RouteProtector routeType="private" />}>
        <Route path={routes.dashboard} element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
