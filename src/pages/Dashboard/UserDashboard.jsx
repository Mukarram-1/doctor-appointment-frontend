import { useState, useEffect } from 'react';
import { Card, Typography, Button, List, Avatar, Tag, message, Spin } from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  MedicineBoxOutlined, 
  ClockCircleOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  StarFilled
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import { StatCard, StatusIcon, StatusTag, PageHeader } from '../../components/UI';

const { Title, Text } = Typography;

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    availableDoctors: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [appointmentsResponse, doctorsResponse] = await Promise.all([
        appointmentService.getUserAppointments(),
        doctorService.getDoctors()
      ]);

      if (appointmentsResponse.success) {
        const appointments = appointmentsResponse.data;
        setRecentAppointments(appointments.slice(0, 5));
        
        setStats({
          totalAppointments: appointments.length,
          upcomingAppointments: appointments.filter(apt => 
            apt.status === 'scheduled' && new Date(apt.appointmentDate) > new Date()
          ).length,
          completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
          availableDoctors: doctorsResponse.success ? doctorsResponse.data.length : 0
        });
      }

      if (doctorsResponse.success) {
        setRecommendedDoctors(doctorsResponse.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'}!`}
        subtitle="Here's an overview of your healthcare journey"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<CalendarOutlined />}
          onClick={() => window.location.href = '/appointments'}
        />
        
        <StatCard
          title="Upcoming"
          value={stats.upcomingAppointments}
          icon={<ClockCircleOutlined />}
          onClick={() => window.location.href = '/appointments'}
        />
        
        <StatCard
          title="Completed"
          value={stats.completedAppointments}
          icon={<MedicineBoxOutlined />}
          onClick={() => window.location.href = '/appointments'}
        />
        
        <StatCard
          title="Available Doctors"
          value={stats.availableDoctors}
          icon={<UserOutlined />}
          onClick={() => window.location.href = '/doctors'}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarOutlined style={{ color: '#1890ff' }} />
                <span style={{ fontWeight: 600, fontSize: '16px' }}>Recent Appointments</span>
              </div>
              <Link to="/appointments">
                <Button 
                  type="link" 
                  size="small"
                  style={{ padding: 0, height: 'auto', color: '#1890ff' }}
                >
                  View All
                </Button>
              </Link>
            </div>
          }
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          bodyStyle={{ padding: '16px' }}
        >
          {recentAppointments.length > 0 ? (
            <List
              dataSource={recentAppointments}
              renderItem={(appointment) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={appointment.doctor?.avatar} 
                        icon={<UserOutlined />}
                        size={40}
                        style={{ backgroundColor: '#f0f0f0' }}
                      />
                      <div>
                        <Text style={{ fontWeight: 500, display: 'block' }}>
                          Dr. {appointment.doctor?.name}
                        </Text>
                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={appointment.status} />
                      <StatusTag status={appointment.status} />
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center py-8">
              <CalendarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Text style={{ color: '#8c8c8c', display: 'block', marginBottom: '16px' }}>
                No appointments yet
              </Text>
              <Link to="/doctors">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  style={{
                    borderRadius: '6px',
                    height: '36px'
                  }}
                >
                  Book Appointment
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Recommended Doctors */}
        <Card 
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MedicineBoxOutlined style={{ color: '#52c41a' }} />
                <span style={{ fontWeight: 600, fontSize: '16px' }}>Recommended Doctors</span>
              </div>
              <Link to="/doctors">
                <Button 
                  type="link" 
                  size="small"
                  style={{ padding: 0, height: 'auto', color: '#1890ff' }}
                >
                  View All
                </Button>
              </Link>
            </div>
          }
          style={{
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          bodyStyle={{ padding: '16px' }}
        >
          {recommendedDoctors.length > 0 ? (
            <List
              dataSource={recommendedDoctors}
              renderItem={(doctor) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div className="w-full">
                    <div className="flex items-start gap-3 mb-2">
                      <Avatar 
                        src={doctor.avatar} 
                        icon={<UserOutlined />}
                        size={48}
                        style={{ backgroundColor: '#f0f0f0' }}
                      />
                      <div className="flex-1">
                        <Text style={{ fontWeight: 500, display: 'block', fontSize: '14px' }}>
                          Dr. {doctor.name}
                        </Text>
                        <Text style={{ fontSize: '12px', color: '#8c8c8c', display: 'block' }}>
                          {doctor.specialization}
                        </Text>
                        <div className="flex items-center gap-1 mt-1">
                          <StarFilled style={{ color: '#fadb14', fontSize: '12px' }} />
                          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            {doctor.rating || '4.5'} ({doctor.reviewsCount || '50'} reviews)
                          </Text>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-12 space-y-1">
                      <div className="flex items-center gap-2">
                        <EnvironmentOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          {doctor.hospital || 'City Hospital'}
                        </Text>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <PhoneOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
                        <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                          {doctor.phone || '+1 234 567 8900'}
                        </Text>
                      </div>
                    </div>

                    <div className="mt-3 ml-12">
                      <Link to={`/doctors/${doctor._id}`}>
                        <Button 
                          type="primary" 
                          size="small"
                          style={{
                            borderRadius: '4px',
                            height: '28px',
                            fontSize: '12px'
                          }}
                        >
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center py-8">
              <MedicineBoxOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <Text style={{ color: '#8c8c8c', display: 'block', marginBottom: '16px' }}>
                No doctors available
              </Text>
              <Link to="/doctors">
                <Button 
                  type="primary"
                  style={{
                    borderRadius: '6px',
                    height: '36px'
                  }}
                >
                  Browse Doctors
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard; 
