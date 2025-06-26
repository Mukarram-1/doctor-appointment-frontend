import { useState, useEffect } from 'react';
import { Button, List, Typography, Empty } from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import StatCard from '../UI/StatCard';
import StatusIcon from '../UI/StatusIcon';
import StatusTag from '../UI/StatusTag';
import PageHeader from '../UI/PageHeader';

const { Text } = Typography;

const UserDashboard = () => {
  const [userAppointments, setUserAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    upcomingAppointments: 0
  });
  const { user } = useAuth();
  const { appointments, fetchAppointments } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserAppointments();
  }, [user?.id]);

  useEffect(() => {
    const myAppointments = appointments.filter(apt => apt.userId === user?.id);
    setUserAppointments(myAppointments);

    const today = new Date().toISOString().split('T')[0];
    const upcoming = myAppointments.filter(apt => apt.date >= today && apt.status !== 'cancelled');
    
    setStats({
      totalAppointments: myAppointments.length,
      pendingAppointments: myAppointments.filter(apt => apt.status === 'pending').length,
      confirmedAppointments: myAppointments.filter(apt => apt.status === 'confirmed').length,
      upcomingAppointments: upcoming.length
    });
  }, [appointments, user?.id]);

  const loadUserAppointments = async () => {
    if (user?.id) {
      await fetchAppointments({ userId: user.id });
    }
  };

  const upcomingAppointments = userAppointments
    .filter(apt => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      return appointmentDate >= today && apt.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const statsData = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: <CalendarOutlined />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: <ClockCircleOutlined />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      title: 'Pending',
      value: stats.pendingAppointments,
      icon: <ClockCircleOutlined />,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Confirmed',
      value: stats.confirmedAppointments,
      icon: <CheckCircleOutlined />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    }
  ];

  const quickActions = [
    {
      label: 'Book New Appointment',
      icon: <PlusOutlined />,
      onClick: () => navigate('/doctors'),
      type: 'primary',
      className: 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700'
    },
    {
      label: 'View My Appointments',
      icon: <CalendarOutlined />,
      onClick: () => navigate('/my-appointments'),
      type: 'default'
    },
    {
      label: 'Browse Doctors',
      icon: <TeamOutlined />,
      onClick: () => navigate('/doctors'),
      type: 'default'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name}!`}
        description="Manage your appointments and find doctors."
      />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  type={action.type}
                  icon={action.icon}
                  size="large"
                  block
                  onClick={action.onClick}
                  className={`h-12 rounded-lg font-medium ${action.className || 'border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'}`}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <Button 
                type="link" 
                onClick={() => navigate('/my-appointments')}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
              >
                View All
              </Button>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <List
                dataSource={upcomingAppointments}
                renderItem={(appointment) => (
                  <List.Item className="px-0 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          Appointment with {appointment.doctorName}
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarOutlined />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockCircleOutlined />
                            <span>{appointment.time}</span>
                          </div>
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
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-gray-500">
                    No upcoming appointments
                  </span>
                }
                className="py-8"
              >
                <Button 
                  type="primary" 
                  onClick={() => navigate('/doctors')}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                >
                  Book Your First Appointment
                </Button>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 