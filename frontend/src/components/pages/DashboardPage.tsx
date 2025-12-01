import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, theme, Space } from 'antd';
import type { GlobalToken } from 'antd';
import styled from 'styled-components';
import { 
  HomeOutlined, 
  UserOutlined, 
  CalendarOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// NOTA: La importación de 'api' se elimina temporalmente ya que la llamada es simulada.
// import api from '../../config/axios';

// --- Styled Components para una mejor interactividad ---
// Creamos un componente Card estilizado para manejar el hover de forma más elegante.
const InteractiveCard = styled(Card)<{ theme: GlobalToken }>`
  // Centramos todo el contenido verticalmente
  .ant-card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 160px; // Esto ayuda a que la tarjeta sea más cuadrada
  }

  // Transición suave para el efecto hover
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px); // La tarjeta se eleva ligeramente
    background-color: ${(props: { theme: GlobalToken }) => props.theme.colorBgLayout}; // Cambia a un color de fondo sutil
  }
`;

const { Title } = Typography;

// Interfaz para las estadísticas
interface DashboardStats {
  availableRooms: number;
  occupiedGuests: number;
  todayCheckIns: number;
}

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({ availableRooms: 0, occupiedGuests: 0, todayCheckIns: 0 });
  const [loading, setLoading] = useState(true);
  
  // Hook para acceder a los colores del tema actual (oscuro en este caso)
  const { token } = theme.useToken(); // token contiene los colores del tema (ej: token.colorPrimary)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulamos una llamada a la API para las estadísticas.
        // Reemplaza esto con tu endpoint real, por ejemplo: api.get('/dashboard/stats');
        const mockStats: DashboardStats = {
          availableRooms: 15,
          occupiedGuests: 32,
          todayCheckIns: 5,
        };
        // const response = await api.get('/dashboard/stats');
        // setStats(response.data);
        setStats(mockStats);
      } catch (error) {
        console.error("Error al cargar estadísticas del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const navigationCards = [
    {
      title: 'Gestionar Habitaciones',
      icon: <DesktopOutlined />,
      description: 'Ver estado, precios y tipos de habitaciones.',
      path: '/rooms',
    },
    {
      title: 'Gestionar Huéspedes',
      icon: <UserOutlined />,
      description: 'Consultar historial y datos de los huéspedes.',
      path: '/guests',
    },
    {
      title: 'Gestionar Reservas',
      icon: <CalendarOutlined />,
      description: 'Crear, ver y administrar las reservas.',
      path: '/bookings',
    },
  ];

  return (
    <>
      <Title level={2}>🏠 Panel de Control</Title>
      
      {/* Sección de Estadísticas */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless">
            <Statistic
              title="Habitaciones Disponibles"
              value={stats.availableRooms}
              prefix={<HomeOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless">
            <Statistic
              title="Huéspedes Actuales"
              value={stats.occupiedGuests}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless">
            <Statistic 
              title="Check-ins Hoy" 
              value={stats.todayCheckIns} 
              prefix={<CalendarOutlined />} 
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Sección de Navegación Rápida */}
      <Title level={3}>Accesos Rápidos</Title>
      <Row gutter={[16, 16]}>
        {navigationCards.map((card) => (
          <Col xs={24} sm={12} md={8} key={card.path}>
            {/* Usamos nuestro nuevo componente InteractiveCard */}
            <InteractiveCard
              onClick={() => navigate(card.path)}
              variant="borderless"
              theme={token} // Pasamos el token del tema para que styled-components lo use
            >
              <Space orientation="vertical" align="center" size="middle">
                {/* Icono más grande y con el color primario del tema */}
                <span style={{ fontSize: '48px', color: token.colorPrimary }}>
                  {card.icon}
                </span>
                <Title level={5}>{card.title}</Title>
                <Typography.Text type="secondary">{card.description}</Typography.Text>
              </Space>
            </InteractiveCard>
          </Col>
        ))}
      </Row>
    </>
  );
};