import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import MainLayout from './components/MainLayout';
import { RoomsPage } from './components/pages/RoomsPage';
import { DashboardPage } from './components/pages/DashboardPage'; // Importamos el nuevo Dashboard
import { LoginPage } from './components/pages/Login/LoginPage';
import { RoomTypesPage } from './components/RoomTypesPage';
import { BedTypesPage } from './components/BedTypesPage'; // 1. Importamos la nueva página
import ProtectedRoute from './components/ProtectedRoute'; // Lo creamos pasos atrás

function App() {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ConfigProvider
      theme={{
        // Cambia el algoritmo dinámicamente basado en el estado
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública: Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas Protegidas (Requieren Token) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout toggleTheme={toggleTheme} currentTheme={currentTheme} />}>
              <Route index element={<DashboardPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="guests" element={<h1>🚧 Huéspedes</h1>} />
              <Route path="bookings" element={<h1>🚧 Reservas</h1>} />
              {/* 2. Añadimos la nueva ruta para la configuración */}
              <Route path="settings/bed-types" element={<BedTypesPage />} />
              <Route path="settings/room-types" element={<RoomTypesPage />} />
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
