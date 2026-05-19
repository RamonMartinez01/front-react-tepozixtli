// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Definimos el "contrato" (Tipado) de nuestro estado
interface AuthState {
  token: string | null;
  // Podríamos agregar 'user' aquí en el futuro si queremos guardar su nombre o ID
  
  // Acciones
  setToken: (token: string) => void;
  logout: () => void;
}

// 2. Creamos el Store
export const useAuthStore = create<AuthState>()(
  // Envolvemos todo en persist para que sobreviva a las recargas del navegador
  persist(
    (set) => ({
      // Estado inicial
      token: null,

      // Acciones para modificar el estado
      setToken: (token: string) => set({ token }),
      
      logout: () => {
        set({ token: null });
        // Opcional: Limpiar otras cosas de localStorage si las hubiera
        // localStorage.removeItem('algo-mas');
      },
    }),
    {
      name: 'tepozixtli-auth', // El nombre de la llave que aparecerá en el LocalStorage
    }
  )
);