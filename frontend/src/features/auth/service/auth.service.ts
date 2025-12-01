import api from '../../../config/axios';

// Tipamos la respuesta esperada del backend (NestJS)
interface LoginResponse {
  access_token: string;
}

interface LoginDTO {
  username?: string;
  password?: string;
}

export const AuthService = {
  login: async (credentials: LoginDTO): Promise<string> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data.access_token;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  }
};