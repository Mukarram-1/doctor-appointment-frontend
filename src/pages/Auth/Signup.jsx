import { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Divider, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signup(values);
      message.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1f2937', fontWeight: 'bold' }}>
            Create Your Account
          </Title>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            Join us to manage your healthcare appointments
          </Text>
        </div>

        <Card 
          style={{
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: 'none'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <Form
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>First Name</span>}
                name="firstName"
                rules={[{ required: true, message: 'Please input your first name!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Enter your first name"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Last Name</span>}
                name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Enter your last name"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Enter your email"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Phone Number</span>}
                name="phone"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Enter your phone number"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Password</span>}
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Create a password"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Confirm Password</span>}
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="Confirm your password"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Date of Birth</span>}
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please select your date of birth!' }]}
              >
                <Input
                  type="date"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500, color: '#374151' }}>Gender</span>}
                name="gender"
                rules={[{ required: true, message: 'Please select your gender!' }]}
              >
                <Select
                  placeholder="Select your gender"
                  style={{
                    borderRadius: '8px'
                  }}
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              label={<span style={{ fontWeight: 500, color: '#374151' }}>Address</span>}
              name="address"
              style={{ marginTop: '16px' }}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter your address"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '8px 12px',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '24px', marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '48px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: '#10b981',
                  borderColor: '#10b981',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0', color: '#9ca3af' }}>
            <Text style={{ color: '#6b7280', fontSize: '14px' }}>or</Text>
          </Divider>

          <div className="text-center">
            <Text style={{ color: '#6b7280' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup; 