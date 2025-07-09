import { Layout, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const Loader = () => (
  <Layout
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <Spin indicator={<LoadingOutlined spin />} />
  </Layout>
);
