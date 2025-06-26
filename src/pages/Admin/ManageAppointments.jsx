import { useState } from 'react';
import { Card, Table, Button, Tag, Typography, Input, Select, Space, Tooltip, message } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import appointmentService from '../../services/appointmentService';

const { Title, Text } = Typography;
const { Option } = Select;

const ManageAppointments = () => {
  const { appointments, setAppointments } = useApp();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      );
      setAppointments(updatedAppointments);
      
      message.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      message.error('Failed to update appointment status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'pending':
        return <ClockCircleOutlined className="text-orange-500" />;
      case 'cancelled':
        return <CloseCircleOutlined className="text-red-500" />;
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
      default:
        return 'default';
    }
  };

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesSearch = appointment.patientName?.toLowerCase().includes(searchText.toLowerCase()) ||
                         appointment.doctorName?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

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
            <Text className="text-gray-500 text-sm block truncate">
              {record.patientEmail}
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
      title: 'Contact',
      key: 'contact',
      width: 140,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <PhoneOutlined className="text-gray-400" />
          <Text className="text-gray-600 text-sm">{record.patientPhone}</Text>
        </div>
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
                onClick={() => handleStatusUpdate(record.id, 'confirmed')}
                loading={loading}
                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 flex-1"
              >
                Confirm
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusUpdate(record.id, 'cancelled')}
                loading={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
          {record.status === 'confirmed' && (
            <Button
              size="small"
              danger
              block
              icon={<CloseCircleOutlined />}
              onClick={() => handleStatusUpdate(record.id, 'cancelled')}
              loading={loading}
            >
              Cancel
            </Button>
          )}
          {record.status === 'cancelled' && (
            <Button
              size="small"
              type="primary"
              block
              icon={<CheckCircleOutlined />}
              onClick={() => handleStatusUpdate(record.id, 'confirmed')}
              loading={loading}
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
            rowKey="id"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="text-center rounded-xl shadow-sm border border-gray-200 bg-green-50">
          <div className="space-y-2">
            <CheckCircleOutlined className="text-4xl text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-900">
                {appointments?.filter(apt => apt.status === 'confirmed')?.length || 0}
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
                {appointments?.filter(apt => apt.status === 'pending')?.length || 0}
              </div>
              <Text className="text-orange-700 font-medium">Pending</Text>
            </div>
          </div>
        </Card>
        
        <Card className="text-center rounded-xl shadow-sm border border-gray-200 bg-red-50">
          <div className="space-y-2">
            <CloseCircleOutlined className="text-4xl text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-900">
                {appointments?.filter(apt => apt.status === 'cancelled')?.length || 0}
              </div>
              <Text className="text-red-700 font-medium">Cancelled</Text>
            </div>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default ManageAppointments; 