import { Button, Card, Col, List, Row, Space, Statistic, Typography } from 'antd';
import { useUserData } from '../contexts/UserContext';
import { useNavigate } from 'react-router';
import { fetchUsers } from '../api/api.ts';
import { useApiRequest } from '../hooks/useApiRequest.ts';
import type { IUserData } from '../types/interfaces.ts';

export function Dashboard() {
  const { user: me, setUser } = useUserData();
  const navigate = useNavigate();

  const { data: users, isLoading } = useApiRequest<IUserData[]>(fetchUsers);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={2}>
          {me?.email}
          {me?.isActivated ? (
            <Statistic
              title="Status"
              value="Activated"
              style={{ display: 'inline-block', marginLeft: '10px' }}
            />
          ) : (
            <Statistic
              title="Status"
              value="Not activated"
              style={{ display: 'inline-block', marginLeft: '10px' }}
            />
          )}
        </Typography.Title>
        <Space>
          <Button type="primary" onClick={logout}>
            Logout
          </Button>
        </Space>
      </Col>
      <Col span={24}>
        <Card title="Users">
          <List
            loading={isLoading}
            dataSource={users || []}
            renderItem={(user) => <List.Item>{user.email}</List.Item>}
          />
        </Card>
      </Col>
    </Row>
  );
}
