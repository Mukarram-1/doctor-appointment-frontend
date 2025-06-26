import { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Typography, Input, Select, Space, Tooltip, message, Modal } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import appointmentService from '../../services/appointmentService';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageAppointments = () => {
  const { appointments, fetchAppointments, loading } = useApp();
  const [actionLoading, setActionLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    await fetchAppointments();
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (newStatus === 'cancelled') {
      setSelectedAppointment(appointmentId);
      setCancelModalVisible(true);
      return;
    }

    try {
      setActionLoading(true);
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      
      await loadAppointments();
      
      message.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      message.error('Failed to update appointment status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancellationReason.trim()) {
      message.error('Please provide a cancellation reason');
      return;
    }

    try {
      setActionLoading(true);
      await appointmentService.updateAppointmentStatus(selectedAppointment, 'cancelled', cancellationReason);
      
      await loadAppointments();
      
      message.success('Appointment cancelled successfully');
      setCancelModalVisible(false);
      setCancellationReason('');
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      message.error('Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelModal = () => {
    setCancelModalVisible(false);
    setCancellationReason('');
    setSelectedAppointment(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'pending':
        return <ClockCircleOutlined className="text-orange-500" />;
      case 'cancelled':
        return <CloseCircleOutlined className="text-red-500" />;
      case 'completed':
        return <CheckCircleOutlined className="text-blue-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
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
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  };

  const formatAppointmentData = (appointments) => {
    return appointments.map(appointment => ({
      ...appointment,
      key: appointment._id || appointment.id,
      patientName: appointment.userId?.name || appointment.patientName || 'N/A',

      doctorName: appointment.doctorId?.name || appointment.doctorName || 'N/A',
      doctorSpecialization: appointment.doctorId?.specialty || appointment.doctorSpecialization || 'N/A',
      fee: appointment.doctorId?.consultationFee || appointment.fee || 0,
      patientPhone: appointment.userId?.phone || appointment.patientPhone || 'N/A',
      date: new Date(appointment.date).toLocaleDateString(),
      time: appointment.time
    }));
  };

  const formattedAppointments = formatAppointmentData(appointments || []);

  const filteredAppointments = formattedAppointments.filter(appointment => {
    const matchesSearch = appointment.patientName?.toLowerCase().includes(searchText.toLowerCase()) ||
                         appointment.doctorName?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Patient',
      key: 'patient',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <UserOutlined className="text-primary-600" />
          </div>
          <div className="min-w-0 flex-1">
            <Text className="font-medium text-gray-900 block truncate">
              {record.patientName}
            </Text>

          </div>
        </div>
      ),
    },
    {
      title: 'Doctor',
      key: 'doctor',
      width: 180,
      render: (_, record) => (
        <div>
          <Text className="font-medium text-gray-900 block">
            Dr. {record.doctorName}
          </Text>
          <Text className="text-gray-500 text-sm">
            {record.doctorSpecialization}
          </Text>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      width: 160,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-gray-400" />
            <Text className="text-gray-900">{record.date}</Text>
          </div>
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-gray-400" />
            <Text className="text-gray-500 text-sm">{record.time}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Reason',
      key: 'reason',
      width: 200,
      render: (_, record) => (
        <Text className="text-gray-600 text-sm">
          {record.reason || 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(record.status)}
          <Tag 
            color={getStatusColor(record.status)} 
            className="rounded-full capitalize font-medium"
          >
            {record.status}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Fee',
      key: 'fee',
      width: 100,
      render: (_, record) => (
        <Text className="font-semibold text-gray-900">
          ${record.fee}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex flex-col gap-2">
          {record.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusUpdate(record._id || record.id, 'confirmed')}
                loading={actionLoading}
                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 flex-1"
              >
                Confirm
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusUpdate(record._id || record.id, 'cancelled')}
                loading={actionLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
          {record.status === 'confirmed' && (
            <div className="flex gap-2">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusUpdate(record._id || record.id, 'completed')}
                loading={actionLoading}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 flex-1"
              >
                Complete
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusUpdate(record._id || record.id, 'cancelled')}
                loading={actionLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
          {record.status === 'cancelled' && (
            <Button
              size="small"
              type="primary"
              block
              icon={<CheckCircleOutlined />}
              onClick={() => handleStatusUpdate(record._id || record.id, 'confirmed')}
              loading={actionLoading}
              className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
            >
              Reactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Title level={2} className="!mb-2 !text-gray-900">
              Manage Appointments
            </Title>
            <Text className="text-gray-600 text-base">
              View and manage all patient appointments
            </Text>
          </div>
          <div className="flex items-center gap-4">
            <Button
              icon={<ReloadOutlined />}
              onClick={loadAppointments}
              loading={loading}
              className="flex items-center"
            >
              Refresh
            </Button>
            <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
              <Text className="text-sm text-gray-500">Total:</Text>
              <Text className="font-semibold text-gray-900 ml-2 text-lg">
                {filteredAppointments.length}
              </Text>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by patient or doctor name..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="h-10 rounded-lg"
                size="large"
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-40"
                size="large"
                suffixIcon={<FilterOutlined className="text-gray-400" />}
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Appointments Table */}
        <Card className="rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-hidden">
            <Table
              columns={columns}
              dataSource={filteredAppointments}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} appointments`,
                className: "mt-4",
              }}
              scroll={{ x: 1200 }}
              className="appointments-table"
              rowClassName={() => 'hover:bg-gray-50 transition-colors'}
            />
          </div>
        </Card>

        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Card className="text-center rounded-xl shadow-sm border border-gray-200 bg-green-50">
            <div className="space-y-2">
              <CheckCircleOutlined className="text-4xl text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {formattedAppointments?.filter(apt => apt.status === 'confirmed')?.length || 0}
                </div>
                <Text className="text-green-700 font-medium">Confirmed</Text>
              </div>
            </div>
          </Card>
          
          <Card className="text-center rounded-xl shadow-sm border border-gray-200 bg-orange-50">
            <div className="space-y-2">
              <ClockCircleOutlined className="text-4xl text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900">
                  {formattedAppointments?.filter(apt => apt.status === 'pending')?.length || 0}
                </div>
                <Text className="text-orange-700 font-medium">Pending</Text>
              </div>
            </div>
          </Card>
          
          <Card className="text-center rounded-xl shadow-sm border border-gray-200 bg-blue-50">
            <div className="space-y-2">
              <CheckCircleOutlined className="text-4xl text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {formattedAppointments?.filter(apt => apt.status === 'completed')?.length || 0}
                </div>
                <Text className="text-blue-700 font-medium">Completed</Text>
              </div>
            </div>
          </Card>
          
          <Card className="text-center rounded-xl shadow-sm border border-gray-200 bg-red-50">
            <div className="space-y-2">
              <CloseCircleOutlined className="text-4xl text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-900">
                  {formattedAppointments?.filter(apt => apt.status === 'cancelled')?.length || 0}
                </div>
                <Text className="text-red-700 font-medium">Cancelled</Text>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Cancellation Modal */}
      <Modal
        title="Cancel Appointment"
        open={cancelModalVisible}
        onOk={handleCancelAppointment}
        onCancel={handleCancelModal}
        confirmLoading={actionLoading}
        okText="Cancel Appointment"
        okButtonProps={{ danger: true }}
        cancelText="Keep Appointment"
      >
        <div className="space-y-4">
          <Text className="text-gray-600">
            Please provide a reason for cancelling this appointment:
          </Text>
          <TextArea
            placeholder="Enter cancellation reason..."
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            rows={3}
            maxLength={200}
            showCount
          />
        </div>
      </Modal>
    </div>
  );
};

export default ManageAppointments; 
