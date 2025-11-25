import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  DesktopOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  HomeOutlined 
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Definición del Menú
  const items = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/rooms', icon: <DesktopOutlined />, label: 'Habitaciones' },
    { key: '/guests', icon: <UserOutlined />, label: 'Huéspedes' },
    { key: '/bookings', icon: <CalendarOutlined />, label: 'Reservas' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu 
          theme="dark" 
          defaultSelectedKeys={[location.pathname]} 
          mode="inline" 
          items={items} 
          onClick={({ key }) => navigate(key)} // Navegación al hacer clic
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Aquí se renderizarán las páginas (Outlet) */}
            <Outlet /> 
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Hotel PMS ©2025 Created by Tu Equipo
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;