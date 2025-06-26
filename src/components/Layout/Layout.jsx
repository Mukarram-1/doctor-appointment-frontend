import { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Typography, Button, Drawer } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  SettingOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
      label: 'Dashboard',
    },
    {
      key: '/doctors',
      icon: <TeamOutlined style={{ fontSize: '16px' }} />,
      label: 'Doctors',
    },
    ...(isAdmin ? [
      {
        key: '/manage-appointments',
        icon: <CalendarOutlined style={{ fontSize: '16px' }} />,
        label: 'Manage Appointments',
      },
      {
        key: '/manage-doctors',
        icon: <SettingOutlined style={{ fontSize: '16px' }} />,
        label: 'Manage Doctors',
      }
    ] : [
      {
        key: '/my-appointments',
        icon: <CalendarOutlined style={{ fontSize: '16px' }} />,
        label: 'My Appointments',
      }
    ])
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const sidebarContent = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0', 
        backgroundColor: 'white',
        textAlign: 'center'
      }}>
        <Text style={{ color: '#1890ff', fontWeight: 600, fontSize: '16px' }}>
          {collapsed && !isMobile ? 'DA' : 'Doctor Appointment'}
        </Text>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, backgroundColor: 'white' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none', height: '100%' }}
        />
      </div>
    </div>
  );

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ 
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            zIndex: 1000,
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
          }}
          width={240}
          collapsedWidth={80}
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen && isMobile}
        bodyStyle={{ padding: 0 }}
        width={240}
        style={{ display: isMobile ? 'block' : 'none' }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Layout */}
      <AntLayout 
        style={{
          marginLeft: !isMobile ? (collapsed ? 80 : 240) : 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Header */}
        <Header style={{
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          height: 64
        }}>
          {/* Menu Toggle */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: '16px' }} />}
            onClick={toggleSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '6px'
            }}
          />

          {/* User Menu */}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.3s',
              ':hover': {
                backgroundColor: '#f5f5f5'
              }
            }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
                size={32}
              />
              <div style={{ 
                display: isMobile ? 'none' : 'block',
                lineHeight: 1.2
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: '#262626',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap'
                }}>
                  {user?.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#8c8c8c', 
                  textTransform: 'capitalize',
                  lineHeight: 1
                }}>
                  {user?.role}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        {/* Content - Add proper padding */}
        <Content style={{ 
          overflow: 'initial',
          padding: isMobile ? '16px' : '24px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f8fafc'
        }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 