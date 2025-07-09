import { Navigate, Outlet } from 'react-router';
import { routes } from './consts/routes.ts';
import { useMeQuery } from './api/api.ts';
import { Loader } from './components/Loader.tsx';
import { getToken } from './services/localstorage.service.ts';
import { useEffect } from 'react';

export function RouteProtector({ routeType }: { routeType: 'public' | 'private' }) {
  const isPrivate = routeType === 'private';
  const token = getToken();
  useEffect(() => {
    return () => {
      console.log('unmount');
    };
  }, []);

  const { currentData: user, isFetching } = useMeQuery(undefined, {
    skip: !token,
  });

  if (isFetching) {
    return <Loader />;
  }

  console.log({ user });
  const isAuthenticated = !!token && !!user;

  if (isPrivate && !isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <Outlet />;
}
