import { Button, Flex, Form, Input, Layout } from 'antd';
import type { IUserLoginForm } from '../types/interfaces.ts';
import { Link, useNavigate } from 'react-router';
import { routes } from '../consts/routes.ts';
import { useMessage } from '../contexts/MessageContext.tsx';
import { useApiMutation } from '../hooks/useApiMutation.ts';
import { login } from '../api/api.ts';

export function Login() {
  const { success } = useMessage();
  const navigate = useNavigate();

  const { mutate, isLoading } = useApiMutation(login);

  const onFinish = async (values: IUserLoginForm) => {
    await mutate(values);
    success('Logged in successfully');
    navigate(routes.dashboard);
  };
  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Form<IUserLoginForm> onFinish={onFinish} style={{ maxWidth: 400, width: '100%' }}>
        <Form.Item name="email" rules={[{ required: true, message: 'Email is required' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Password is too short, min length is 6' },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item noStyle>
          <Flex vertical align={'center'} justify={'center'}>
            <Button
              loading={isLoading}
              style={{ paddingInline: 40 }}
              type="primary"
              htmlType="submit"
              children="Login"
            />
            <Link to={routes.register} style={{ marginTop: 10 }}>
              Register
            </Link>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
}
