import { useEffect, useState } from 'react';
import { Table, Typography, Alert, Button, Modal, Form, Input, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import api from '../config/axios';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// 1. Interfaz de datos para el Frontend
interface BedType {
  id: number;
  name: string;
}

export const BedTypesPage = () => {
  // 2. Estados para los datos, carga y errores
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBedType, setEditingBedType] = useState<BedType | null>(null);
  const [form] = Form.useForm();

  const fetchBedTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get<BedType[]>('/bed-types');
      setBedTypes(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los tipos de cama. Por favor, intente de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar datos al iniciar el componente
  useEffect(() => {
    fetchBedTypes();
  }, []);

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingBedType) {
          // Lógica de Actualización
          const response = await api.patch<BedType>(`/bed-types/${editingBedType.id}`, values);
          setBedTypes(bedTypes.map(bt => (bt.id === editingBedType.id ? response.data : bt)));
          message.success('Tipo de cama actualizado exitosamente');
        } else {
          // Lógica de Creación
          const response = await api.post<BedType>('/bed-types', values);
          setBedTypes([...bedTypes, response.data]);
          message.success('Tipo de cama creado exitosamente');
        }
        setIsModalVisible(false);
      } catch (err) {
        message.error(`Error al ${editingBedType ? 'actualizar' : 'crear'} el tipo de cama`);
        console.error(err);
      }
    });
  };

  const showCreateModal = () => {
    setEditingBedType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: BedType) => {
    setEditingBedType(record);
    form.setFieldsValue({ name: record.name });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBedType(null);
    form.resetFields();
  };

  // 4. Definición de columnas para la tabla
  const columns: ColumnsType<BedType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Nombre del Tipo de Cama',
      dataIndex: 'name',
      key: 'name',
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
      <Title level={2}>Gestión de Tipos de Cama</Title>
      <Paragraph>Aquí puedes administrar los diferentes tipos de cama disponibles en el hotel.</Paragraph>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={showCreateModal}>
        Crear Tipo de Cama
      </Button>
      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Table dataSource={bedTypes} columns={columns} rowKey="id" loading={loading} bordered />

      <Modal
        title={editingBedType ? 'Editar Tipo de Cama' : 'Crear Nuevo Tipo de Cama'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingBedType ? 'Guardar Cambios' : 'Crear'}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical" name="bed_type_form">
          <Form.Item
            name="name"
            label="Nombre del Tipo de Cama"
            rules={[{ required: true, message: 'Por favor, ingrese el nombre del tipo de cama' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};