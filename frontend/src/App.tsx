import { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

const { Title } = Typography;

// 1. Definimos cómo se ve una Habitación en el Frontend (Igual que en el Backend)
interface Room {
  id: number;
  roomNumber: string;
  type: string;
  pricePerNight: string; // Viene como string del backend a veces por el tipo 'decimal'
  status: string;
}

function App() {
  // 2. Estado para guardar las habitaciones
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Función para pedir datos al Backend
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Hacemos la petición al puerto 3000
      const response = await axios.get('http://localhost:3000/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Error cargando habitaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Configuración de las columnas de la Tabla (Ant Design)
  const columns: ColumnsType<Room> = [
    {
      title: 'Número',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Precio',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      render: (price) => `$ ${price}`,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        // Colores automáticos según el estado
        let color = 'green';
        if (status === 'OCCUPIED') color = 'volcano';
        if (status === 'DIRTY') color = 'gold';
        
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  // 5. Renderizamos la UI
  return (
    <div style={{ padding: '50px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card>
        <Title level={2}>🏨 Gestión de Habitaciones</Title>
        <Table 
          dataSource={rooms} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          bordered
        />
      </Card>
    </div>
  );
}

export default App;