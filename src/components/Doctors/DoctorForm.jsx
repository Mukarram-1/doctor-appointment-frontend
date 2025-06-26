import { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

const { Option } = Select;

const specialties = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Surgery',
  'Urology'
];

const DoctorForm = ({ doctor, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        ...doctor,
        specialty: doctor.specialization // Map specialization to specialty
      });
    } else {
      form.resetFields();
    }
  }, [doctor, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        specialization: values.specialty
      };
      await onSubmit(formattedValues);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label={<span style={{ color: '#374151', fontWeight: 500 }}>Doctor Name</span>}
            rules={[
              { required: true, message: 'Please enter doctor name!' },
              { min: 2, message: 'Name must be at least 2 characters!' }
            ]}
          >
            <Input
              placeholder="Enter doctor's full name"
              style={{
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px 12px',
                fontSize: '16px',
                height: '40px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="qualifications"
            label={<span style={{ color: '#374151', fontWeight: 500 }}>Qualifications</span>}
            rules={[
              { required: true, message: 'Please enter qualifications!' }
            ]}
          >
            <Input
              placeholder="MBBS, MD, etc."
              style={{
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px 12px',
                fontSize: '16px',
                height: '40px'
              }}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="specialty"
            label={<span style={{ color: '#374151', fontWeight: 500 }}>Specialty</span>}
            rules={[{ required: true, message: 'Please select specialty!' }]}
          >
            <Select
              placeholder="Select specialty"
              showSearch
              style={{
                borderRadius: '8px',
                height: '40px'
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {specialties.map(specialty => (
                <Option key={specialty} value={specialty}>
                  {specialty}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="experience"
            label={<span style={{ color: '#374151', fontWeight: 500 }}>Experience (Years)</span>}
            rules={[{ required: true, message: 'Please enter experience!' }]}
          >
            <Input
              type="number"
              placeholder="Years of experience"
              min={0}
              max={50}
              style={{
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px 12px',
                fontSize: '16px',
                height: '40px'
              }}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="phone"
            label={<span style={{ color: '#374151', fontWeight: 500 }}>Phone</span>}
            rules={[{ required: true, message: 'Please enter phone number!' }]}
          >
            <Input
              placeholder="Phone number"
              style={{
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px 12px',
                fontSize: '16px',
                height: '40px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="fee"
            label={<span style={{ color: '#374151', fontWeight: 500 }}>Consultation Fee ($)</span>}
            rules={[{ required: true, message: 'Please enter consultation fee!' }]}
          >
            <Input
              type="number"
              placeholder="Consultation fee"
              min={0}
              style={{
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                padding: '8px 12px',
                fontSize: '16px',
                height: '40px'
              }}
            />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            onClick={onCancel}
            icon={<CloseOutlined />}
            style={{
              height: '40px',
              padding: '0 24px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              color: '#374151',
              backgroundColor: '#ffffff'
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            style={{
              height: '40px',
              padding: '0 24px',
              borderRadius: '8px',
              backgroundColor: '#3b82f6',
              borderColor: '#3b82f6'
            }}
          >
            {doctor ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DoctorForm; 
