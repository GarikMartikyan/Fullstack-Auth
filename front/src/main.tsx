import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { BrowserRouter } from 'react-router';
import { ConfigProvider, theme } from 'antd';
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
);
