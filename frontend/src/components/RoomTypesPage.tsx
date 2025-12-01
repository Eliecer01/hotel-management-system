import { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Alert,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import api from '../config/axios';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Interfaces que coinciden con el backend
interface BedType {
  id: number;
  name: string;
}

interface RoomType {
  id: number;
  name: string;
  description: string;
  pricePerNight: number;
  beds: BedType[];
}

export const RoomTypesPage = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allBedTypes, setAllBedTypes] = useState<BedType[]>([]); // Para el selector
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Hacemos ambas peticiones en paralelo para optimizar
        const [roomTypesResponse, bedTypesResponse] = await Promise.all([
          api.get<RoomType[]>('/room-types'),
          api.get<BedType[]>('/bed-types'),
        ]);
        setRoomTypes(roomTypesResponse.data);
        setAllBedTypes(bedTypesResponse.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los tipos de habitación. Por favor, intente de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showCreateModal = () => {
    setEditingRoomType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: RoomType) => {
    setEditingRoomType(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      pricePerNight: record.pricePerNight,
      bedIds: record.beds.map(bed => bed.id), // Mapeamos los objetos cama a sus IDs
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRoomType(null);
  };

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingRoomType) {
          // Lógica de Actualización
          const response = await api.patch<RoomType>(`/room-types/${editingRoomType.id}`, values);
          setRoomTypes(roomTypes.map(rt => (rt.id === editingRoomType.id ? response.data : rt)));
          message.success('Tipo de habitación actualizado exitosamente');
        } else {
          // Lógica de Creación
          const response = await api.post<RoomType>('/room-types', values);
          setRoomTypes([...roomTypes, response.data]);
          message.success('Tipo de habitación creado exitosamente');
        }
        setIsModalVisible(false);
      } catch (err) {
        message.error(`Error al ${editingRoomType ? 'actualizar' : 'crear'} el tipo de habitación`);
        console.error(err);
      }
    });
  };

  const columns: ColumnsType<RoomType> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Precio por Noche',
      dataIndex: 'pricePerNight',
      key: 'pricePerNight',
      render: (price) => price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }),
    },
    {
      title: 'Camas Incluidas',
      dataIndex: 'beds',
      key: 'beds',
      render: (beds: BedType[]) => (
        <>
          {beds.map(bed => (
            <Tag color="blue" key={bed.id}>{bed.name}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Gestión de Tipos de Habitación</Title>
      <Paragraph>
        Administra los diferentes tipos de habitación que ofrece el hotel, su precio y las camas que incluyen.
      </Paragraph>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={showCreateModal}>
        Crear Tipo de Habitación
      </Button>
      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Table dataSource={roomTypes} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal
        title={editingRoomType ? 'Editar Tipo de Habitación' : 'Crear Nuevo Tipo de Habitación'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingRoomType ? 'Guardar Cambios' : 'Crear'}
        cancelText="Cancelar"
        width={600}
      >
        <Form form={form} layout="vertical" name="room_type_form">
          <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'El nombre es obligatorio' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="pricePerNight" label="Precio por Noche" rules={[{ required: true, message: 'El precio es obligatorio' }]}>
            <InputNumber min={0} style={{ width: '100%' }} addonBefore="$" />
          </Form.Item>
          <Form.Item name="bedIds" label="Camas Incluidas" rules={[{ required: true, message: 'Debe seleccionar al menos una cama' }]}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Seleccione los tipos de cama"
              options={allBedTypes.map(bed => ({
                label: bed.name,
                value: bed.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};