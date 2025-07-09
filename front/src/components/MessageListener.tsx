import { message } from 'antd';
import { useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector.ts';
import { messageSelector } from '../store/slices/messageSlice.ts';

export function MessageListener() {
  const [messageApi, contextHolder] = message.useMessage();
  const messageState = useAppSelector(messageSelector);

  useEffect(() => {
    if (messageState.content) {
      messageApi.open(messageState);
    }
  }, [messageState]);

  return contextHolder;
}
