import { type ReactNode, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext.tsx';
import type { IUserData } from '../types/interfaces.ts';
import { useApiRequest } from '../hooks/useApiRequest.ts';
import { Loader } from '../components/Loader.tsx';
import { fetchMe } from '../api/api.ts';
import { getToken } from '../services/localstorage.service.ts';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUserData | null>(null);

  const { data: UserData, isLoading } = useApiRequest<IUserData>(fetchMe, { skip: !getToken() });

  useEffect(() => {
    if (UserData && !isLoading) {
      setUser(UserData);
    }
  }, [isLoading, UserData]);

  if (!!getToken() && isLoading) {
    return <Loader />;
  }

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
