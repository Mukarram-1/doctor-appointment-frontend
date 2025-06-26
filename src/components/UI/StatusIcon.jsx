import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const StatusIcon = ({ status, className = '' }) => {
  const getIcon = () => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleOutlined className={`text-green-500 ${className}`} />;
      case 'pending':
        return <ClockCircleOutlined className={`text-orange-500 ${className}`} />;
      case 'cancelled':
        return <ExclamationCircleOutlined className={`text-red-500 ${className}`} />;
      default:
        return <ClockCircleOutlined className={`text-gray-500 ${className}`} />;
    }
  };

  return getIcon();
};

export default StatusIcon; 