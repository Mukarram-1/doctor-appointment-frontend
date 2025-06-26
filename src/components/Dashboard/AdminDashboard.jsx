import { Card, Statistic, Typography, List, Avatar, Tag, Button, Row, Col } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { appointments, doctors } = useApp();
  const navigate = useNavigate();

  const totalAppointments = appointments?.length || 0;
  const totalDoctors = doctors?.length || 0;
  const pendingAppointments = appointments?.filter(apt => apt.status === 'pending')?.length || 0;
  const totalRevenue = appointments?.reduce((sum, apt) => sum + (apt.fee || 0), 0) || 0;

  const recentAppointments = appointments?.slice(0, 5) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'cancelled':
        return <ExclamationCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div style={{ backgroundColor: 'transparent', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={14}>
            <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '28px', fontWeight: 600 }}>
              Admin Dashboard
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '8px', display: 'block' }}>
              Manage your clinic operations and monitor key metrics
            </Text>
          </Col>
          <Col xs={24} sm={24} md={12} lg={10}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/manage-doctors')}
                style={{ 
                  borderRadius: '8px', 
                  fontWeight: 500,
                  height: '44px',
                  minWidth: '140px'
                }}
              >
                Manage Doctors
              </Button>
              <Button 
                size="large"
                onClick={() => navigate('/manage-appointments')}
                style={{ 
                  borderRadius: '8px', 
                  fontWeight: 500,
                  height: '44px',
                  minWidth: '140px'
                }}
              >
                View All Appointments
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Statistics Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 12px rgba(24, 144, 255, 0.1)' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c', fontSize: '14px', fontWeight: 500 }}>Total Appointments</span>}
              value={totalAppointments}
              prefix={<CalendarOutlined style={{ color: '#1890ff', fontSize: '24px' }} />}
              valueStyle={{ color: '#262626', fontSize: '32px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 12px rgba(82, 196, 26, 0.1)' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c', fontSize: '14px', fontWeight: 500 }}>Total Doctors</span>}
              value={totalDoctors}
              prefix={<TeamOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
              valueStyle={{ color: '#262626', fontSize: '32px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 12px rgba(250, 173, 20, 0.1)' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c', fontSize: '14px', fontWeight: 500 }}>Pending Requests</span>}
              value={pendingAppointments}
              prefix={<ClockCircleOutlined style={{ color: '#faad14', fontSize: '24px' }} />}
              valueStyle={{ color: '#262626', fontSize: '32px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 12px rgba(114, 46, 209, 0.1)' }}>
            <Statistic
              title={<span style={{ color: '#8c8c8c', fontSize: '14px', fontWeight: 500 }}>Total Revenue</span>}
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: '#722ed1', fontSize: '24px' }} />}
              valueStyle={{ color: '#262626', fontSize: '32px', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Content Grid */}
      <Row gutter={[24, 24]}>
        {/* Recent Appointments */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                  <span style={{ fontWeight: 600, color: '#262626', fontSize: '16px' }}>Recent Appointments</span>
                </div>
                <Button 
                  type="link" 
                  onClick={() => navigate('/manage-appointments')}
                  style={{ color: '#1890ff', fontWeight: 500, padding: 0 }}
                >
                  View All
                </Button>
              </div>
            }
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            bodyStyle={{ padding: 0 }}
          >
            {recentAppointments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={recentAppointments}
                renderItem={(appointment) => (
                  <List.Item 
                    style={{ 
                      padding: '16px 24px', 
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fafafa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={<UserOutlined />} 
                          style={{ backgroundColor: '#e6f7ff', color: '#1890ff' }}
                          size={40}
                        />
                      }
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                          <Text style={{ fontWeight: 500, color: '#262626', fontSize: '15px' }}>
                            {appointment.patientName}
                          </Text>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {getStatusIcon(appointment.status)}
                            <Tag color={getStatusColor(appointment.status)} style={{ borderRadius: '12px', fontSize: '12px' }}>
                              {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                            </Tag>
                          </div>
                        </div>
                      }
                      description={
                        <div style={{ marginTop: '4px' }}>
                          <Text style={{ color: '#595959', display: 'block', fontSize: '14px' }}>
                            Dr. {appointment.doctorName}
                          </Text>
                          <Text style={{ color: '#8c8c8c', fontSize: '13px' }}>
                            {appointment.date} at {appointment.time}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <CalendarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>No appointments yet</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Quick Actions and Status */}
        <Col xs={24} lg={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Actions */}
            <Card 
              title={<span style={{ fontWeight: 600, color: '#262626', fontSize: '16px' }}>Quick Actions</span>}
              style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button 
                  block 
                  size="large"
                  onClick={() => navigate('/manage-doctors')}
                  style={{ 
                    height: '48px', 
                    borderRadius: '8px', 
                    fontWeight: 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                  icon={<TeamOutlined style={{ fontSize: '16px' }} />}
                >
                  Add New Doctor
                </Button>
                <Button 
                  block 
                  size="large"
                  onClick={() => navigate('/manage-appointments')}
                  style={{ 
                    height: '48px', 
                    borderRadius: '8px', 
                    fontWeight: 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                  icon={<CalendarOutlined style={{ fontSize: '16px' }} />}
                >
                  Manage Appointments
                </Button>
                <Button 
                  block 
                  size="large"
                  onClick={() => navigate('/doctors')}
                  style={{ 
                    height: '48px', 
                    borderRadius: '8px', 
                    fontWeight: 500,
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                  }}
                  icon={<UserOutlined style={{ fontSize: '16px' }} />}
                >
                  View Doctor Directory
                </Button>
              </div>
            </Card>

            {/* Appointment Status */}
            <Card 
              title={<span style={{ fontWeight: 600, color: '#262626', fontSize: '16px' }}>Appointment Status</span>}
              style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px', 
                  backgroundColor: '#f6ffed', 
                  borderRadius: '8px',
                  border: '1px solid #b7eb8f'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                    <Text style={{ fontWeight: 500, color: '#389e0d', fontSize: '14px' }}>Confirmed</Text>
                  </div>
                  <Text style={{ fontWeight: 600, color: '#389e0d', fontSize: '16px' }}>
                    {appointments?.filter(apt => apt.status === 'confirmed')?.length || 0}
                  </Text>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px', 
                  backgroundColor: '#fff7e6', 
                  borderRadius: '8px',
                  border: '1px solid #ffd591'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClockCircleOutlined style={{ color: '#faad14', fontSize: '16px' }} />
                    <Text style={{ fontWeight: 500, color: '#d48806', fontSize: '14px' }}>Pending</Text>
                  </div>
                  <Text style={{ fontWeight: 600, color: '#d48806', fontSize: '16px' }}>
                    {pendingAppointments}
                  </Text>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px', 
                  backgroundColor: '#fff2f0', 
                  borderRadius: '8px',
                  border: '1px solid #ffccc7'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: '16px' }} />
                    <Text style={{ fontWeight: 500, color: '#cf1322', fontSize: '14px' }}>Cancelled</Text>
                  </div>
                  <Text style={{ fontWeight: 600, color: '#cf1322', fontSize: '16px' }}>
                    {appointments?.filter(apt => apt.status === 'cancelled')?.length || 0}
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
      </div>
    </div>
  );
};

export default AdminDashboard; 
