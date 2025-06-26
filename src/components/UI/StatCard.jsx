import { Card, Typography } from 'antd';

const { Text } = Typography;

const StatCard = ({ 
  title, 
  value, 
  icon, 
  onClick,
  className = ''
}) => {
  return (
    <Card 
      className={className}
      style={{ 
        padding: 0,
        border: '2px solid #e3e8ef',
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s'
      }}
      bodyStyle={{ padding: '24px' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Text 
            style={{ 
              color: '#6b7280', 
              fontSize: '14px', 
              fontWeight: 500, 
              display: 'block', 
              marginBottom: '8px' 
            }}
          >
            {title}
          </Text>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '20px', color: '#3b82f6' }}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard; 