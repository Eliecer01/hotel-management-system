import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Layout } from "antd";
import { UserOutlined, LockOutlined, BankOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import { AuthService } from "../../../features/auth/service/auth.service";
import styles from "./LoginPage.module.css";

const { Title, Text } = Typography;

export interface LoginFieldType {
  username?: string;
  password?: string;
}

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFieldType) => {
    setLoading(true);
    try {
      const token = await AuthService.login(values);

      localStorage.setItem("token", token);
      message.success("¡Bienvenido de nuevo!");
      navigate("/");
    } catch (error) {
      console.error(error);

      // Definimos un mensaje por defecto
      let errorMsg = "Usuario o contraseña incorrectos";

      // 👈 Verificamos si es un error de Axios
      if (error instanceof AxiosError) {
        // Intentamos leer el mensaje que envía NestJS
        // Asumimos que Nest devuelve algo como { statusCode: 401, message: "..." }
        const backendMessage = error.response?.data?.message;

        // Si el mensaje es un array (común en validaciones de Nest), tomamos el primero, si es string, lo usamos
        if (Array.isArray(backendMessage)) {
          errorMsg = backendMessage[0];
        } else if (typeof backendMessage === "string") {
          errorMsg = backendMessage;
        }
      }

      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            {/* Usamos un icono SVG que podemos colorear con CSS */}
            <BankOutlined style={{ color: "#ffd700" }} /* Dorado */ />
          </div>
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
            rules={[{ required: true, message: "¡Ingresa tu usuario!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario (admin)" />
          </Form.Item>

          <Form.Item<LoginFieldType>
            name="password"
            rules={[{ required: true, message: "¡Ingresa tu contraseña!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña (123)"
            />
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
