import { useState } from 'react';
import { Modal, Form, DatePicker, TimePicker, Button, Typography, Space, Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';

const { Title, Text } = Typography;

const AppointmentModal = ({ visible, doctor, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createAppointment } = useApp();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const appointmentData = {
        userId: user.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        userName: user.name,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
      };

      const result = await createAppointment(appointmentData);
      
      if (result.success) {
        form.resetFields();
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const disabledDate = (current) => {
    // Disable past dates
    return current && current < moment().startOf('day');
  };

  const disabledTime = (selectedDate) => {
    const now = moment();
    const isToday = selectedDate && selectedDate.isSame(now, 'day');
    
    return {
      disabledHours: () => {
        if (isToday) {
          return [...Array(now.hour())].map((_, i) => i);
        }
        return [];
      },
      disabledMinutes: (selectedHour) => {
        if (isToday && selectedHour === now.hour()) {
          return [...Array(now.minute())].map((_, i) => i);
        }
        return [];
      },
    };
  };

  if (!doctor) return null;

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          <span>Book Appointment</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
          {doctor.name}
        </Title>
        <Tag color="blue">{doctor.specialty}</Tag>
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          {typeof doctor.location === 'object' && doctor.location 
            ? `${doctor.location.hospital}, ${doctor.location.address}, ${doctor.location.city}, ${doctor.location.state} ${doctor.location.zipCode}`
            : doctor.location || 'Location not specified'
          }
        </Text>
        
        <div style={{ marginTop: '16px' }}>
          <Text strong>Available Days: </Text>
          <Space wrap>
            {doctor.availability && doctor.availability.map((availabilitySlot, index) => (
              <Tag key={index} color="green" size="small">
                {typeof availabilitySlot === 'object' ? availabilitySlot.day : availabilitySlot}
              </Tag>
            ))}
          </Space>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="date"
          label="Appointment Date"
          rules={[{ required: true, message: 'Please select a date!' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={disabledDate}
            placeholder="Select date"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          name="time"
          label="Appointment Time"
          rules={[{ required: true, message: 'Please select a time!' }]}
        >
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            placeholder="Select time"
            minuteStep={15}
            disabledTime={disabledTime}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<ClockCircleOutlined />}
            >
              Book Appointment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentModal; 