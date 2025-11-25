import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verificamos si existe el token en el almacenamiento local
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    // Si no hay token, lo mandamos al Login y reemplazamos la historia
    // para que no pueda volver atrás con el botón del navegador.
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizamos el contenido hijo (Dashboard, Rooms, etc.)
  return <Outlet />;
};

export default ProtectedRoute;