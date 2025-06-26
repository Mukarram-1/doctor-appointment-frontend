import { Card, Button, Tag, Space, Typography, Avatar } from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  CalendarOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Text, Title } = Typography;
const { Meta } = Card;

const DoctorCard = ({ doctor, onBookAppointment }) => {
  const { user } = useAuth();
  const isUser = user?.role === 'user';

  const handleBookAppointment = () => {
    onBookAppointment(doctor);
  };

  return (
    <Card
      style={{ height: '100%' }}
      cover={
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          <Avatar 
            size={80} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#1890ff',
              marginBottom: '12px'
            }}
          />
          <Title level={4} style={{ margin: 0 }}>
            {doctor.name}
          </Title>
          <Tag color="blue" style={{ marginTop: '8px' }}>
            {doctor.specialty}
          </Tag>
        </div>
      }
      actions={isUser ? [
        <Button
          key="book"
          type="primary"
          icon={<CalendarOutlined />}
          onClick={handleBookAppointment}
          style={{ margin: '0 16px' }}
        >
          Book Appointment
        </Button>
      ] : []}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EnvironmentOutlined style={{ color: '#666' }} />
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {doctor.location}
          </Text>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PhoneOutlined style={{ color: '#666' }} />
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {doctor.contact}
          </Text>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '8px'
          }}>
            <ClockCircleOutlined style={{ color: '#666' }} />
            <Text strong style={{ fontSize: '13px' }}>Available Days:</Text>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {doctor.availability.map((day, index) => (
              <Tag key={index} size="small" color="green">
                {day}
              </Tag>
            ))}
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default DoctorCard; 