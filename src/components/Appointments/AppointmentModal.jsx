import { useState } from 'react';
import { Modal, Form, DatePicker, TimePicker, Button, Typography, Space, Tag, Input, Select } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AppointmentModal = ({ visible, doctor, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useAuth();
  const { createAppointment } = useApp();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const appointmentData = {
        userId: user._id || user.id,
        doctorId: doctor._id || doctor.id,
        date: values.date.format('YYYY-MM-DD'),
        time: typeof values.time === 'string' ? values.time : values.time.format('HH:mm'),
        reason: values.reason,
        notes: values.notes || '',
        status: 'pending'
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
    setSelectedDate(null);
    onCancel();
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf('day');
  };

  const getAvailableTimes = () => {
    if (!selectedDate || !doctor.availability) return [];
    
    const dayName = selectedDate.format('dddd');
    const availableSlot = doctor.availability.find(slot => slot.day === dayName);
    
    if (!availableSlot) return [];
    
    const times = [];
    const start = moment(availableSlot.startTime, 'HH:mm');
    const end = moment(availableSlot.endTime, 'HH:mm');
    
    while (start.isBefore(end)) {
      times.push(start.format('HH:mm'));
      start.add(30, 'minutes');
    }
    
    return times;
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    form.setFieldsValue({ time: null });
  };

  if (!doctor) return null;

  const availableTimes = getAvailableTimes();

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
      width={600}
    >
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
          Dr. {doctor.name}
        </Title>
        <Tag color="blue">{doctor.specialty}</Tag>
        <div style={{ marginTop: '8px' }}>
          <Text type="secondary">
            {doctor.location?.hospital}, {doctor.location?.address}
          </Text>
        </div>
        <div style={{ marginTop: '8px' }}>
          <Text type="secondary">
            {doctor.location?.city}, {doctor.location?.state} {doctor.location?.zipCode}
          </Text>
        </div>
        <div style={{ marginTop: '8px' }}>
          <Text type="secondary">Phone: {doctor.contact?.phone}</Text>
        </div>
        <div style={{ marginTop: '8px' }}>
          <Text type="secondary">Consultation Fee: ${doctor.consultationFee}</Text>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <Text strong>Available Days: </Text>
          <Space wrap>
            {doctor.availability && doctor.availability.map((slot, index) => (
              <Tag key={index} color="green" size="small">
                {slot.day} ({slot.startTime} - {slot.endTime})
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
            onChange={handleDateChange}
          />
        </Form.Item>

        {selectedDate && availableTimes.length > 0 ? (
          <Form.Item
            name="time"
            label="Available Time Slots"
            rules={[{ required: true, message: 'Please select a time!' }]}
          >
            <Select placeholder="Select an available time slot" style={{ width: '100%' }}>
              {availableTimes.map(time => (
                <Option key={time} value={time}>
                  {moment(time, 'HH:mm').format('h:mm A')}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : selectedDate && availableTimes.length === 0 ? (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fff2e8', border: '1px solid #ffbb96', borderRadius: '6px' }}>
            <Text type="warning">
              Dr. {doctor.name} is not available on {selectedDate.format('dddd')}. Please select another date.
            </Text>
          </div>
        ) : (
          <Form.Item
            name="time"
            label="Appointment Time"
            rules={[{ required: true, message: 'Please select a time!' }]}
          >
            <TimePicker
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="First select a date to see available times"
              minuteStep={30}
              disabled={!selectedDate}
              disabledTime={disabledTime}
            />
          </Form.Item>
        )}

        <Form.Item
          name="reason"
          label="Reason for Appointment"
          rules={[{ required: true, message: 'Please provide a reason for your appointment!' }]}
        >
          <TextArea
            placeholder="Describe your symptoms or reason for the visit"
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Additional Notes (Optional)"
        >
          <TextArea
            placeholder="Any additional information you'd like to share"
            rows={2}
            maxLength={1000}
            showCount
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
              disabled={selectedDate && availableTimes.length === 0}
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
