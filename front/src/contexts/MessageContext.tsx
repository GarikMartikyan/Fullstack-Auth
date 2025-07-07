import { createContext, useContext } from 'react';

export type MessageContextType = {
  error: (msg: string) => void;
  success: (msg: string) => void;
  warning: (msg: string) => void;
};

export const MessageContext = createContext<MessageContextType | null>(null);

export const useMessage = () => useContext(MessageContext) as MessageContextType;
