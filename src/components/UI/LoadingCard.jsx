import { Card, Skeleton } from 'antd';

const LoadingCard = ({ 
  rows = 4, 
  avatar = true, 
  className = '' 
}) => {
  return (
    <Card className={`h-full ${className}`}>
      <Skeleton active avatar={avatar} paragraph={{ rows }} />
    </Card>
  );
};

export default LoadingCard; 