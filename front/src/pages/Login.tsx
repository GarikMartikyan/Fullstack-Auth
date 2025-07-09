import { Button, Flex, Form, Input, Layout } from 'antd';
import type { IUserLoginForm } from '../types/interfaces.ts';
import { Link, useNavigate } from 'react-router';
import { routes } from '../consts/routes.ts';

import { useLoginMutation } from '../api/api.ts';
import { useDispatch } from 'react-redux';
import { showMessage } from '../store/slices/messageSlice.ts';

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const onFinish = async (values: IUserLoginForm) => {
    await login(values).unwrap();
    dispatch(
      showMessage({
        type: 'success',
        content: 'Logged in successfully',
      }),
    );
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
      <Form<IUserLoginForm>
        onFinish={onFinish}
        style={{ maxWidth: 400, width: '100%' }}
        autoComplete="on"
      >
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
          <Input.Password autoComplete="on" placeholder="Password" />
        </Form.Item>
        <Form.Item noStyle>
          <Flex vertical align={'center'} justify={'center'}>
            <Button
              loading={isLoginLoading}
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
