// src/features/auth/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { loginApi } from './api/auth';

export const LoginForm = () => {
  const [nombre_usuario, setNombreUsuario] = useState(''); 
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.access_token, data.usuario);
      // Navegación inteligente basada en el rol que nos devuelve el backend
      const destination = data.usuario.rol === 'admin' ? '/admin/regiones' : '/dashboard';
      navigate(destination, { replace: true });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ nombre_usuario, password }); 
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Input Usuario */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
          <input 
            type="text" 
            value={nombre_usuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            placeholder="Ej: charly.admin"
            required
          />
        </div>

        {/* Input Password (¡Aquí está el uso de setPassword!) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Retroalimentación de Error */}
        {isError && (
          <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded">
            Credenciales incorrectas o error de conexión.
          </div>
        )}
        
        {/* Botón de Submit */}
        <button 
          type="submit" 
          disabled={isPending} 
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-md transition-colors"
        >
          {isPending ? 'Entrando al Sistema...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};