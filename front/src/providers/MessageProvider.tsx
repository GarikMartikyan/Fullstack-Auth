import { message } from 'antd';
import { MessageContext } from '../contexts/MessageContext.tsx';

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const error = (msg: string) => messageApi.error(msg);
  const success = (msg: string) => messageApi.success(msg);
  const warning = (msg: string) => messageApi.warning(msg);

  return (
    <MessageContext.Provider value={{ error, success, warning }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};
