import { useState, useEffect } from 'react';
import { Card, List, Empty, Avatar, Button } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined
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
  }, [user?._id, user?.id]);

  useEffect(() => {
    const userId = user?._id || user?.id;
    const myAppointments = appointments
      .filter(apt => {
        const aptUserId = apt.userId?._id || apt.userId?.id || apt.userId;
        return aptUserId === userId;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setUserAppointments(myAppointments);
    setLoading(false);
  }, [appointments, user?._id, user?.id]);

  const loadUserAppointments = async () => {
    const userId = user?._id || user?.id;
    if (userId) {
      setLoading(true);
      await fetchAppointments({ userId });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDoctorName = (appointment) => {
    if (appointment.doctorId?.name) {
      return `Dr. ${appointment.doctorId.name}`;
    }
    if (appointment.doctorName) {
      return appointment.doctorName.startsWith('Dr.') ? appointment.doctorName : `Dr. ${appointment.doctorName}`;
    }
    return 'Doctor';
  };

  const getDoctorInfo = (appointment) => {
    const doctor = appointment.doctorId;
    if (doctor) {
      return {
        specialty: doctor.specialty,
        location: doctor.location?.hospital || '',
        phone: doctor.contact?.phone || ''
      };
    }
    return {
      specialty: '',
      location: '',
      phone: ''
    };
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        <PageHeader
          title="My Appointments"
          description="View and manage your doctor appointments"
        />

        <Card 
          style={{
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}
          title={
            <div className="flex items-center gap-2">
              <CalendarOutlined style={{ color: '#2563eb' }} />
              <span style={{ fontWeight: 600, color: '#111827' }}>
                All Appointments ({userAppointments.length})
              </span>
            </div>
          }
        >
          {userAppointments.length > 0 ? (
            <List
              dataSource={userAppointments}
              renderItem={(appointment) => {
                const doctorInfo = getDoctorInfo(appointment);
                return (
                  <List.Item style={{ 
                    padding: '20px 0', 
                    borderBottom: '1px solid #f3f4f6' 
                  }}>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar 
                          icon={<UserOutlined />} 
                          size={56}
                          style={{
                            backgroundColor: '#dbeafe',
                            color: '#2563eb'
                          }}
                        />
                        <div className="flex-1">
                          <div style={{
                            fontWeight: 600,
                            color: '#111827',
                            marginBottom: '4px',
                            fontSize: '16px'
                          }}>
                            {getDoctorName(appointment)}
                          </div>
                          
                          {doctorInfo.specialty && (
                            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                              {doctorInfo.specialty}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm" style={{ color: '#6b7280', marginBottom: '8px' }}>
                            <div className="flex items-center gap-2">
                              <CalendarOutlined />
                              <span>{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockCircleOutlined />
                              <span>{formatTime(appointment.time)}</span>
                            </div>
                          </div>

                          {doctorInfo.location && (
                            <div className="flex items-center gap-2" style={{ color: '#6b7280', fontSize: '13px', marginBottom: '4px' }}>
                              <EnvironmentOutlined />
                              <span>{doctorInfo.location}</span>
                            </div>
                          )}

                          {appointment.consultationFee && (
                            <div className="flex items-center gap-2" style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
                              <DollarOutlined />
                              <span>Consultation Fee: ${appointment.consultationFee}</span>
                            </div>
                          )}

                          {appointment.reason && (
                            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                              <strong>Reason:</strong> {appointment.reason}
                            </div>
                          )}

                          {appointment.notes && (
                            <div style={{ color: '#6b7280', fontSize: '13px' }}>
                              <strong>Notes:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <StatusTag status={appointment.status} />
                        
                        {appointment.status === 'pending' && (
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Awaiting confirmation
                          </div>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <div style={{ fontSize: '12px', color: '#059669' }}>
                            Confirmed appointment
                          </div>
                        )}
                        
                        {appointment.status === 'cancelled' && (
                          <div style={{ fontSize: '12px', color: '#dc2626' }}>
                            Appointment cancelled
                          </div>
                        )}
                        
                        {appointment.status === 'completed' && (
                          <div style={{ fontSize: '12px', color: '#7c3aed' }}>
                            Appointment completed
                          </div>
                        )}
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          ) : (
            <Empty
              description={<span style={{ color: '#6b7280' }}>No appointments found</span>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: '32px 0' }}
            />
          )}
        </Card>

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
            <Button 
              type="primary" 
              icon={<CalendarOutlined />}
              size="large"
              onClick={() => window.location.href = '/doctors'}
            >
              Browse Doctors
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments; 
