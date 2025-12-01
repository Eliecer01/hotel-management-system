import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Collapse,
  Empty,
  Row,
  Spin,
  Tag,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  type FormInstance,
} from "antd";
import api from "../../config/axios";
import { isAxiosError } from "axios";
import styled, { css } from "styled-components";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

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

interface Room {
  id: number;
  floor: number;
  roomNumber: string;
  status: "AVAILABLE" | "OCCUPIED" | "DIRTY" | "MAINTENANCE";
  roomType: RoomType;
}

// Un mapa para asociar estados con colores. Facilita añadir nuevos estados.
const statusColorMap: Record<Room["status"], string> = {
  AVAILABLE: "green",
  OCCUPIED: "volcano",
  DIRTY: "gold",
  MAINTENANCE: "default",
};

// Mapa para las etiquetas de estado en español
const statusLabelMap: Record<Room["status"], string> = {
  AVAILABLE: "Disponibles",
  OCCUPIED: "Ocupadas",
  DIRTY: "Sucia",
  MAINTENANCE: "Mantenimiento",
};

// --- Styled Components para las tarjetas de habitación ---
// Le damos un borde de color según el estado para una identificación rápida.
const RoomCard = styled(Card)<{ status: Room["status"] }>`
  position: relative; /* 1. Hacemos que la tarjeta sea el contexto de posicionamiento */
  border-top: 5px solid ${(props) => statusColorMap[props.status] || "cyan"};

  .ant-card-body {
    padding: 16px;
    min-height: 120px; /* 1. Añadimos una altura mínima al cuerpo de la tarjeta */
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  /* 2. Hacemos el botón de editar más visible al pasar el cursor */
  .edit-button {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 50%;
}

&:hover .edit-button {
  background: rgba(255, 255, 255, 0.25);
}
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
`;

export const RoomsPage = () => {
  // Estado para las habitaciones agrupadas por piso
  const [roomsByFloor, setRoomsByFloor] = useState<Record<string, Room[]>>({});
  const [allRoomTypes, setAllRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsResponse, roomTypesResponse] = await Promise.all([
        api.get<Room[]>("/rooms"),
        api.get<RoomType[]>("/room-types"),
      ]);

      const groupedByFloor = roomsResponse.data.reduce((acc, room) => {
        const floor = room.floor.toString();
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(room);
        return acc;
      }, {} as Record<string, Room[]>);

      setRoomsByFloor(groupedByFloor);
      setAllRoomTypes(roomTypesResponse.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      message.error("No se pudieron cargar los datos de las habitaciones.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al iniciar
  useEffect(() => {
    fetchData();
  }, []);

  const showCreateModal = () => {
    setEditingRoom(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (room: Room) => {
    setEditingRoom(room);
    form.setFieldsValue({
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: room.status,
      roomTypeId: room.roomType?.id,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRoom(null);
  };

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingRoom) {
          // Lógica de Actualización
          await api.patch(`/rooms/${editingRoom.id}`, values);
          message.success("Habitación actualizada exitosamente");
        } else {
          // Lógica de Creación
          await api.post("/rooms", values);
          message.success("Habitación creada exitosamente");
        }
        setIsModalVisible(false);
        fetchData(); // Recargamos todos los datos para mostrar la nueva habitación
      } catch (err) {
        const action = editingRoom ? "actualizar" : "crear";
        let errorMsg = `Error al ${action} la habitación`;
        if (isAxiosError(err)) {
          // Si es un error de Axios, podemos acceder de forma segura a la respuesta
          errorMsg = err.response?.data?.message || errorMsg;
        }
        console.error(err);
        message.error(errorMsg);
      }
    });
  };

  // Si está cargando, mostramos un spinner centrado
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Si no hay habitaciones, mostramos un mensaje amigable
  if (Object.keys(roomsByFloor).length === 0) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            🏨 Gestión de Habitaciones
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showCreateModal}
          >
            Crear Habitación
          </Button>
        </div>
        <Empty description="No se encontraron habitaciones. ¡Intenta agregar algunas!" />
        {/* El modal se debe renderizar aquí también para poder crear la primera habitación */}
        <RoomFormModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onCreate={handleSubmit}
          editingRoom={editingRoom}
          form={form}
          roomTypes={allRoomTypes}
        />
      </>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          🏨 Gestión de Habitaciones
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Crear Habitación
        </Button>
      </div>

      <Collapse
        accordion
        defaultActiveKey={["1"]}
        items={Object.keys(roomsByFloor)
          .sort((a, b) => Number(a) - Number(b))
          .map((floor) => {
            return {
              key: floor,
              label: (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    gap: "24px",
                  }}
                >
                  <Title level={4} style={{ margin: 0, flexShrink: 0 }}>
                    Piso {floor}
                  </Title>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      overflow: "hidden",
                    }}
                  >
                    {(Object.keys(statusLabelMap) as Array<Room["status"]>).map(
                      (status) => {
                        const count = roomsByFloor[floor].filter(
                          (r) => r.status === status
                        ).length;
                        if (count === 0) return null;
                        return (
                          <Tag
                            color={statusColorMap[status]}
                            key={status}
                            style={{ margin: 0 }}
                          >
                            {statusLabelMap[status]}: {count}
                          </Tag>
                        );
                      }
                    )}
                  </div>
                </div>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {roomsByFloor[floor].map((room) => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={room.id}>
                      <RoomCard status={room.status} hoverable>
                        <Button
                          type="text"
                          shape="circle"
                          icon={<EditOutlined />}
                          className="edit-button"
                          style={{ position: "absolute", bottom: 8, right: 8 }}
                          onClick={() => showEditModal(room)}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Title level={5} style={{ margin: 0 }}>
                            Hab. {room.roomNumber}
                          </Title>
                          <Tag color={statusColorMap[room.status]}>
                            {room.status}
                          </Tag>
                        </div>
                        <Text type="secondary">
                          {room.roomType?.name ?? "Tipo no asignado"}
                        </Text>
                        <div style={{ marginTop: "12px", fontSize: "16px" }}>
                          <Text strong>
                            {(room.roomType?.pricePerNight ?? 0).toLocaleString(
                              "es-MX",
                              { style: "currency", currency: "MXN" }
                            )}
                          </Text>
                          <Text> / noche</Text>
                        </div>
                      </RoomCard>
                    </Col>
                  ))}
                </Row>
              ),
            };
          })}
      />

      <RoomFormModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onCreate={handleSubmit}
        form={form}
        roomTypes={allRoomTypes}
        editingRoom={editingRoom}
      />
    </>
  );
};

// 1. Definimos una interfaz para los props del modal
interface RoomFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: () => void;
  form: FormInstance;
  roomTypes: RoomType[];
  editingRoom: Room | null;
}

// Componente separado para el Modal de Creación para mantener el código limpio
const RoomFormModal = ({
  visible,
  onCancel,
  onCreate,
  form,
  roomTypes,
  editingRoom,
}: RoomFormModalProps) => {
  // 2. Usamos la nueva interfaz en lugar de 'any'
  return (
    <Modal
      open={visible}
      title={
        editingRoom
          ? `Editar Habitación ${editingRoom.roomNumber}`
          : "Crear Nueva Habitación"
      }
      okText={editingRoom ? "Guardar Cambios" : "Crear"}
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form form={form} layout="vertical" name="create_room_form">
        <Form.Item
          name="roomNumber"
          label="Número de Habitación"
          rules={[{ required: true, message: "El número es obligatorio" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="floor"
          label="Piso"
          rules={[{ required: true, message: "El piso es obligatorio" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="roomTypeId"
          label="Tipo de Habitación"
          rules={[{ required: true, message: "Debe seleccionar un tipo" }]}
        >
          <Select
            placeholder="Seleccione un tipo de habitación"
            options={roomTypes.map((rt: RoomType) => ({
              label: rt.name,
              value: rt.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Estado Inicial"
          initialValue="AVAILABLE"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { value: "AVAILABLE", label: "Disponible" },
              { value: "DIRTY", label: "Sucia" },
              { value: "MAINTENANCE", label: "Mantenimiento" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
