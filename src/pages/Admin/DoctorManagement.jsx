import { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Popconfirm, Input, Tag, Avatar } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import DoctorForm from '../../components/Doctors/DoctorForm';
import { PageHeader } from '../../components/UI';

const DoctorManagement = () => {
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const { doctors, loading, fetchDoctors, createDoctor, updateDoctor, deleteDoctor } = useApp();

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, searchText]);

  const loadDoctors = async () => {
    await fetchDoctors();
  };

  const applyFilters = () => {
    let filtered = [...doctors];
    if (searchText) {
      filtered = filtered.filter(doctor => {
        const searchTerm = searchText.toLowerCase();
        const locationText = typeof doctor.location === 'object' && doctor.location
          ? `${doctor.location.hospital} ${doctor.location.city} ${doctor.location.state}`.toLowerCase()
          : (doctor.location || '').toLowerCase();
        
        return doctor.name.toLowerCase().includes(searchTerm) ||
               doctor.specialization.toLowerCase().includes(searchTerm) ||
               locationText.includes(searchTerm);
      });
    }
    setFilteredDoctors(filtered);
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setModalVisible(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setModalVisible(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    await deleteDoctor(doctorId);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingDoctor(null);
  };

  const handleFormSubmit = async (values) => {
    if (editingDoctor) {
      await updateDoctor(editingDoctor._id || editingDoctor.id, values);
    } else {
      await createDoctor(values);
    }
    setModalVisible(false);
    setEditingDoctor(null);
  };

  const columns = [
    {
      title: 'Doctor',
      key: 'doctor',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            icon={<UserOutlined />} 
            size={40} 
            style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}
          />
          <div>
            <div style={{ fontWeight: 500, color: '#111827' }}>{record.name}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{record.contact?.email || record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Specialty',
      dataIndex: 'specialization',
      key: 'specialization',
      width: 180,
      render: (specialty) => (
        <Tag 
          color="blue" 
          style={{ borderRadius: '16px', padding: '2px 8px' }}
        >
          {specialty}
        </Tag>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      width: 120,
      render: (exp) => <span style={{ color: '#374151' }}>{exp} years</span>,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      width: 100,
      render: (fee, record) => <span className="font-semibold text-gray-900">${fee || record.consultationFee || 'N/A'}</span>,
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (phone, record) => <span className="text-gray-600">{phone || record.contact?.phone || 'N/A'}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditDoctor(record)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Doctor"
            description="Are you sure you want to delete this doctor?"
            onConfirm={() => handleDeleteDoctor(record._id || record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const addDoctorButton = (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleAddDoctor}
      className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
    >
      Add Doctor
    </Button>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-8">
        <PageHeader
          title="Doctor Management"
          description="Manage doctors and their information"
          actions={addDoctorButton}
        />

        <Card className="rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
          <Input
            placeholder="Search doctors..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-sm rounded-lg"
            size="large"
            allowClear
          />
          <div className="flex items-center gap-2 text-gray-600">
            <TeamOutlined />
            <span>Total: {filteredDoctors.length}</span>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey={(record) => record._id || record.id}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} doctors`,
          }}
          scroll={{ x: 1000 }}
          className="rounded-lg"
          rowClassName={() => 'hover:bg-gray-50 transition-colors'}
        />
      </Card>

      <Modal
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        className="top-8"
      >
        <DoctorForm
          doctor={editingDoctor}
          onSubmit={handleFormSubmit}
          onCancel={handleModalCancel}
        />
      </Modal>
      </div>
    </div>
  );
};

export default DoctorManagement; 