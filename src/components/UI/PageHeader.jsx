import { Typography } from 'antd';

const { Title, Text } = Typography;

const PageHeader = ({ 
  title, 
  description, 
  actions = null, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div>
        <Title level={2} className="!mb-2 !text-gray-900">
          {title}
        </Title>
        {description && (
          <Text className="text-gray-600 text-base">
            {description}
          </Text>
        )}
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 