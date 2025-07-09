import { Button, Card, Col, Layout, List, Row, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { useGetUsersQuery, useLogoutMutation, useMeQuery } from '../api/api.ts';
import { Loader } from '../components/Loader.tsx';
import { useDispatch } from 'react-redux';
import { showMessage } from '../store/slices/messageSlice.ts';

export function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: me, isFetching: isFetchingMe } = useMeQuery();
  const { data: users, isFetching: isFetchingUsers } = useGetUsersQuery();
  const [logoutUser, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const logout = async () => {
    await logoutUser().unwrap();
    navigate('/login');
    dispatch(
      showMessage({
        type: 'success',
        content: 'Logged out successfully',
      }),
    );
  };

  if (isFetchingMe || isLogoutLoading) {
    return <Loader />;
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
        padding: '20px 40px',
        display: 'flex',
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row justify="space-between" align="middle">
            <Typography.Text>{me?.email}</Typography.Text>
            <Button type="primary" onClick={logout}>
              Logout
            </Button>
          </Row>
        </Col>
        <Col span={24}>
          <Card title="Users">
            <List
              loading={isFetchingUsers}
              dataSource={users || []}
              renderItem={(user) => <List.Item>{user.email}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
