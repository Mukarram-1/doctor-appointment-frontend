import { useState, useEffect } from 'react';
import { Card, List, Empty, Avatar } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import { PageHeader, StatusTag } from '../../components/UI';

const MyAppointments = () => {
  const [userAppointments, setUserAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { appointments, fetchAppointments } = useApp();

  useEffect(() => {
    loadUserAppointments();
  }, [user?.id]);

  useEffect(() => {
    const myAppointments = appointments
      .filter(apt => apt.userId === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setUserAppointments(myAppointments);
    setLoading(false);
  }, [appointments, user?.id]);

  const loadUserAppointments = async () => {
    if (user?.id) {
      setLoading(true);
      await fetchAppointments({ userId: user.id });
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date().setHours(0, 0, 0, 0);
  };

  const upcomingAppointments = userAppointments.filter(apt => 
    isUpcoming(apt.date) && apt.status !== 'cancelled'
  );
  const pastAppointments = userAppointments.filter(apt => 
    !isUpcoming(apt.date) || apt.status === 'cancelled'
  );

  const AppointmentCard = ({ appointments, title, icon, emptyMessage, isUpcoming = false }) => (
    <Card 
      style={{
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}
      title={
        <div className="flex items-center gap-2">
          {icon}
          <span style={{ fontWeight: 600, color: '#111827' }}>
            {title} ({appointments.length})
          </span>
        </div>
      }
    >
      {appointments.length > 0 ? (
        <List
          dataSource={appointments}
          renderItem={(appointment) => (
            <List.Item style={{ 
              padding: '16px 0', 
              borderBottom: '1px solid #f3f4f6' 
            }}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <Avatar 
                    icon={<UserOutlined />} 
                    size={48}
                    style={{
                      backgroundColor: isUpcoming ? '#dbeafe' : '#f3f4f6',
                      color: isUpcoming ? '#2563eb' : '#6b7280'
                    }}
                  />
                  <div>
                    <div style={{
                      fontWeight: 500,
                      color: isUpcoming ? '#111827' : '#6b7280',
                      marginBottom: '4px'
                    }}>
                      {appointment.doctorName}
                    </div>
                    <div className="flex items-center gap-4 text-sm" style={{ color: '#6b7280' }}>
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
                </div>
                <StatusTag status={appointment.status} />
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description={<span style={{ color: '#6b7280' }}>{emptyMessage}</span>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '32px 0' }}
        />
      )}
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        <PageHeader
          title="My Appointments"
          description="View and manage your doctor appointments"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AppointmentCard
          appointments={upcomingAppointments}
          title="Upcoming Appointments"
          icon={<ClockCircleOutlined style={{ color: '#16a34a' }} />}
          emptyMessage="No upcoming appointments"
          isUpcoming={true}
        />

        <AppointmentCard
          appointments={pastAppointments}
          title="Past Appointments"
          icon={<CheckCircleOutlined style={{ color: '#6b7280' }} />}
          emptyMessage="No past appointments"
          isUpcoming={false}
        />
      </div>

      {userAppointments.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ExclamationCircleOutlined className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Appointments Yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't booked any appointments yet. Start by finding a doctor.
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default MyAppointments; 