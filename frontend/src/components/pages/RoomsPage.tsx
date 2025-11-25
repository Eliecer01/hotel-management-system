import { useEffect, useState } from 'react';
import { Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import api from '../../config/axios';

const { Title } = Typography;

// Interfaz de datos
interface Room {
  id: number;
  roomNumber: string;
  type: string;
  pricePerNight: string;
  status: string;
}

// Un mapa para asociar estados con colores. Facilita añadir nuevos estados.
const statusColorMap: { [key: string]: string } = {
  AVAILABLE: 'green',
  OCCUPIED: 'volcano',
  DIRTY: 'gold',
  MAINTENANCE: 'default',
};

export const RoomsPage = () => {
  // Estado
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Recuerda: Aquí usamos localhost, pero idealmente vendrá de una variable de entorno
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Error cargando habitaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Definición de columnas
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
        return (
          <Tag color={statusColorMap[status] || 'cyan'} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  // Renderizado limpio (sin estilos de layout extra)
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Title level={2}>🏨 Gestión de Habitaciones</Title>
      </div>
      
      <Table 
        dataSource={rooms} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }} // Añadido paginación por si tienes muchas habitaciones
      />
    </>
  );
};