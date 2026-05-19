// src/features/auth/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../config/apiClient';
import { useAuthStore } from '../../stores/authStore';

export const LoginForm = () => {
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  // El motor de React Query: maneja asincronismo de forma elegante
  const loginMutation = useMutation({
    mutationFn: async (credentials: Record<string, string>) => {
      // Recuerda: Nuestro FastAPI MVP fue configurado para recibir JSON puro
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // 1. Guardamos el "pase de abordar" en la memoria persistente
      setToken(data.access_token);
      // 2. Despegamos hacia el panel principal
      navigate('/dashboard', { replace: true });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ telefono, password });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
          <input 
            type="text" 
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="5551234567"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Manejo de errores automático gracias a React Query */}
        {loginMutation.isError && (
          <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
            Credenciales incorrectas o error de conexión.
          </div>
        )}

        <button 
          type="submit" 
          disabled={loginMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400 transition-colors"
        >
          {loginMutation.isPending ? 'Conectando motores...' : 'Entrar al Sistema'}
        </button>
      </form>
    </div>
  );
};