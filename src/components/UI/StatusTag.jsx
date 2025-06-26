import { Tag } from 'antd';

const StatusTag = ({ status, className = '' }) => {
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

  return (
    <Tag 
      color={getStatusColor(status)} 
      className={`rounded-full capitalize font-medium ${className}`}
    >
      {status}
    </Tag>
  );
};

export default StatusTag; 
