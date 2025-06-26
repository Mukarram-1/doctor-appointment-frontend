import { useAuth } from '../../hooks/useAuth';
import AdminDashboard from '../../components/Dashboard/AdminDashboard';
import UserDashboard from '../../components/Dashboard/UserDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};

export default Dashboard; 