import { useUserData } from './contexts/UserContext.tsx';
import { Navigate, Outlet } from 'react-router';
import { routes } from './consts/routes.ts';

export function RouteProtector({ routeType }: { routeType: 'public' | 'private' }) {
  const isPrivate = routeType === 'private';
  const { user } = useUserData();
  console.log(isPrivate ? 'private' : 'public');

  if (isPrivate && !user) {
    return <Navigate to={routes.login} replace />;
  }

  if (!isPrivate && user) {
    return <Navigate to={routes.dashboard} replace />;
  }

  return <Outlet />;
}
