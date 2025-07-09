import { Button, Flex, Form, Input, Layout } from 'antd';
import type { IUserRegisterForm } from '../types/interfaces.ts';
import { Link, useNavigate } from 'react-router';
import { routes } from '../consts/routes.ts';
import { useRegisterMutation } from '../api/api.ts';
import { useDispatch } from 'react-redux';
import { showMessage } from '../store/slices/messageSlice.ts';

export function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const onFinish = async (values: IUserRegisterForm) => {
    if (values.password !== values.confirmPassword) {
      return dispatch(
        showMessage({
          type: 'error',
          content: 'Passwords do not match',
        }),
      );
    }

    await registerUser({
      email: values.email,
      password: values.password,
    }).unwrap();

    dispatch(
      showMessage({
        type: 'success',
        content: 'Registered successfully',
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
          <Input.Password autoComplete="on" placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: 'Confirm Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password autoComplete="on" placeholder="Confirm Password" />
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
