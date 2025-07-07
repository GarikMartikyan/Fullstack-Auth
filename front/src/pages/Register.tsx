import { Button, Flex, Form, Input, Layout } from 'antd';
import type { IUserRegisterForm } from '../types/interfaces.ts';
import { Link, useNavigate } from 'react-router';
import { routes } from '../consts/routes.ts';
import { useMessage } from '../contexts/MessageContext.tsx';
import api, { createUser } from '../api/api.ts';
import { useApiMutation } from '../hooks/useApiMutation.ts';
import { useEffect } from 'react';
import { API_URL } from '../consts/consts.ts';

export function Register() {
  console.log({ API_URL });
  const { error, success } = useMessage();
  const navigate = useNavigate();

  const { mutate, isLoading } = useApiMutation(createUser);

  useEffect(() => {
    // console.log('This is the response:');
    api.post(
      '/login',
      { email: 'garikmartikyan03@gmail.com', password: 'asdasd' },
      {
        withCredentials: true,
      },
    );
  }, []);

  const onFinish = async (values: IUserRegisterForm) => {
    if (values.password !== values.confirmPassword) {
      return error('Passwords do not match');
    }

    await mutate({
      email: values.email,
      password: values.password,
    });

    success('Registered successfully');
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
      <Form<IUserRegisterForm>
        onFinish={onFinish}
        style={{ maxWidth: 400, width: '100%' }}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item name="email" rules={[{ required: true, message: 'Email is required' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: 'Confirm Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
        <Form.Item noStyle>
          <Flex vertical align={'center'} justify={'center'}>
            <Button
              loading={isLoading}
              style={{ paddingInline: 40 }}
              type="primary"
              htmlType="submit"
              children="Register"
            />
            <Link to={routes.login} style={{ marginTop: 10 }}>
              Login
            </Link>
          </Flex>
        </Form.Item>
      </Form>
    </Layout>
  );
}
