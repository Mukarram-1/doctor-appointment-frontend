import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import DoctorDirectory from './pages/Doctors/DoctorDirectory';
import MyAppointments from './pages/Appointments/MyAppointments';
import ManageAppointments from './pages/Admin/ManageAppointments';
import DoctorManagement from './pages/Admin/DoctorManagement';
import ProtectedRoute from './components/Common/ProtectedRoute';
import { AuthProvider } from './contexts';
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="doctors" element={<DoctorDirectory />} />
                  <Route path="my-appointments" element={
                    <ProtectedRoute allowedRoles={['user']}>
                      <MyAppointments />
                    </ProtectedRoute>
                  } />
                  <Route path="manage-appointments" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ManageAppointments />
                    </ProtectedRoute>
                  } />
                  <Route path="manage-doctors" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DoctorManagement />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
