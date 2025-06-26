import { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Divider, Alert } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login({ email: values.email, password: values.password });
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      message.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1f2937', fontWeight: 'bold' }}>
            Welcome Back
          </Title>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            Sign in to your account to continue
          </Text>
        </div>

        <Card 
          style={{
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: 'none'
          }}
          styles={{ padding: '32px' }}
        >
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              label={<span style={{ fontWeight: 500, color: '#374151' }}>Email Address</span>}
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
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
              label={<span style={{ fontWeight: 500, color: '#374151' }}>Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Enter your password"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '8px 12px',
                  fontSize: '16px'
                }}
              />
            </Form.Item>

            <div className="flex items-center justify-between mb-6">
              <div>
                {/* Space for "Remember me" checkbox if needed */}
              </div>
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item style={{ marginBottom: '16px' }}>
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
                  backgroundColor: '#3b82f6',
                  borderColor: '#3b82f6',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '24px 0', color: '#9ca3af' }}>
            <Text style={{ color: '#6b7280', fontSize: '14px' }}>or</Text>
          </Divider>

          <div className="text-center">
            <Text style={{ color: '#6b7280' }}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login; 