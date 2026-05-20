// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../features/auth/types';


// Definimos el "contrato" (Tipado) de nuestro estado
interface AuthState {
  token: string | null;
  user: User | null;
  
  // Acciones
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

// Creamos el Store
export const useAuthStore = create<AuthState>()(
  // Envolvemos todo en persist para que sobreviva a las recargas del navegador
  persist(
    (set) => ({
      // Estado inicial
      token: null,
      user: null,

      // Acciones para modificar el estado
      setAuth: (token: string, user: User) => set({ token, user }),
      
      logout: () => {
        set({ token: null, user: null });
        // Opcional: Limpiar otras cosas de localStorage si las hubiera
        // localStorage.removeItem('algo-mas');
      },
    }),
    {
      name: 'tepozixtli-auth', // El nombre de la llave que aparecerá en el LocalStorage
    }
  )
);