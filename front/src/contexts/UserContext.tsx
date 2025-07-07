import { createContext, useContext } from 'react';
import type { IUserData } from '../types/interfaces.ts';

export interface UserContextType {
  user: null | IUserData;
  setUser: (user: IUserData | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUserData = () => {
  return useContext(UserContext);
};
