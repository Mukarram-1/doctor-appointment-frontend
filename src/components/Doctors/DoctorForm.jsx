import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Typography, Space, TimePicker, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';


const { Option } = Select;
const { Title } = Typography;

const specialties = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Medicine',
  'Gynecology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery',
  'Urology',
  'Other'
];

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DoctorForm = ({ doctor, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctor) {
      // Format the doctor data for the form
      const formData = {
        name: doctor.name,
        specialty: doctor.specialty || doctor.specialization,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        availability: doctor.availability || [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
        hospital: doctor.location?.hospital,
        address: doctor.location?.address,
        city: doctor.location?.city,
        state: doctor.location?.state,
        zipCode: doctor.location?.zipCode,
        phone: doctor.contact?.phone,
        consultationFee: doctor.consultationFee || doctor.fee
      };
      form.setFieldsValue(formData);
    } else {
      form.setFieldsValue({
        availability: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }]
      });
    }
  }, [doctor, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Form values before formatting:', values);
      
      const formattedValues = {
        name: values.name,
        specialty: values.specialty,
        qualifications: values.qualifications,
        experience: parseInt(values.experience),
        availability: values.availability || [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
        location: {
          hospital: values.hospital,
          address: values.address,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode
        },
        contact: {
          phone: values.phone
        },
        consultationFee: parseFloat(values.consultationFee)
      };
      
      console.log('Formatted values being sent:', formattedValues);
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
        initialValues={{
          availability: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }]
        }}
      >
        <Card title="Basic Information" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Doctor Name"
                rules={[
                  { required: true, message: 'Please enter doctor name!' },
                  { min: 2, message: 'Name must be at least 2 characters!' }
                ]}
              >
                <Input placeholder="Enter doctor's full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="specialty"
                label="Specialty"
                rules={[{ required: true, message: 'Please select specialty!' }]}
              >
                <Select
                  placeholder="Select specialty"
                  showSearch
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="qualifications"
                label="Qualifications"
                rules={[{ required: true, message: 'Please enter qualifications!' }]}
              >
                <Input placeholder="MBBS, MD, etc." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="experience"
                label="Experience (Years)"
                rules={[{ required: true, message: 'Please enter experience!' }]}
              >
                <Input
                  type="number"
                  placeholder="Years of experience"
                  min={0}
                  max={50}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter phone number!' },
                  { pattern: /^\+?[\d\s\-()]{10,}$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input placeholder="+1-555-0123" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="consultationFee"
                label="Consultation Fee ($)"
                rules={[
                  { required: true, message: 'Please enter consultation fee!' },
                  { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid fee amount' }
                ]}
              >
                <Input
                  type="number"
                  placeholder="100"
                  min={0}
                  step="0.01"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Location Information" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hospital"
                label="Hospital/Clinic Name"
                rules={[{ required: true, message: 'Please enter hospital name!' }]}
              >
                <Input placeholder="City General Hospital" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address!' }]}
              >
                <Input placeholder="123 Main Street" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city!' }]}
              >
                <Input placeholder="New York" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please enter state!' }]}
              >
                <Input placeholder="NY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="zipCode"
                label="Zip Code"
                rules={[
                  { required: true, message: 'Please enter zip code!' },
                  { pattern: /^\d{5}(-\d{4})?$/, message: 'Please enter a valid zip code (12345 or 12345-6789)' }
                ]}
              >
                <Input placeholder="10001" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Availability Schedule" className="mb-4">
          <Form.List
            name="availability"
            rules={[
              {
                validator: async (_, availability) => {
                  if (!availability || availability.length < 1) {
                    return Promise.reject(new Error('At least one availability slot is required'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} align="middle" className="mb-2">
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'day']}
                        rules={[{ required: true, message: 'Select day' }]}
                      >
                        <Select placeholder="Select day">
                          {daysOfWeek.map(day => (
                            <Option key={day} value={day}>{day}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'startTime']}
                        rules={[{ required: true, message: 'Start time required' }]}
                      >
                        <Input placeholder="09:00" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, 'endTime']}
                        rules={[{ required: true, message: 'End time required' }]}
                      >
                        <Input placeholder="17:00" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ day: 'Monday', startTime: '09:00', endTime: '17:00' })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Availability Slot
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            onClick={onCancel}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            {doctor ? 'Update Doctor' : 'Add Doctor'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DoctorForm; 
