import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const { Title, Text } = Typography;

// 1. Definimos qué forma tienen los datos del formulario
interface LoginFieldType {
  username?: string;
  password?: string;
}

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 2. Usamos la interfaz aquí en lugar de 'any'
  const onFinish = async (values: LoginFieldType) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });

      localStorage.setItem('token', data.access_token);
      message.success('¡Bienvenido de nuevo!');
      navigate('/');
      
    } catch (error) {
      // 3. Manejo seguro del error (sin usar 'any' explícito)
      console.error(error);
      message.error('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏨</div>
          <Title level={3}>Hotel PMS</Title>
          <Text type="secondary">Ingresa tus credenciales</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          autoComplete="off"
        >
          <Form.Item<LoginFieldType>
            name="username"
            rules={[{ required: true, message: '¡Ingresa tu usuario!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario (admin)" />
          </Form.Item>

          <Form.Item<LoginFieldType>
            name="password"
            rules={[{ required: true, message: '¡Ingresa tu contraseña!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña (123)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};