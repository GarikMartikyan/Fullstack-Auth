import { Navigate, Outlet } from 'react-router';
import { routes } from './consts/routes.ts';
import { useMeQuery } from './api/api.ts';
import { Loader } from './components/Loader.tsx';
import { getToken } from './services/localstorage.service.ts';

export function RouteProtector({ routeType }: { routeType: 'public' | 'private' }) {
  const isPrivate = routeType === 'private';
  const token = getToken();

  const { currentData: user, isFetching } = useMeQuery(undefined, {
    skip: !token,
  });

  console.log(user);

  if (isFetching) {
    return <Loader />;
  }

  const isAuthenticated = !!token && !!user;

  if (isPrivate && !isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <Outlet />;
}
