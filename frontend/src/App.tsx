import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { RoomsPage } from './components/pages/RoomsPage';
import { LoginPage } from './components/pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // Lo creamos pasos atrás

const Dashboard = () => <h1>🏠 Bienvenido al Panel de Control</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas (Requieren Token) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="guests" element={<h1>🚧 Huéspedes</h1>} />
            <Route path="bookings" element={<h1>🚧 Reservas</h1>} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;