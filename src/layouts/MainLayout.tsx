// src/app/layouts/MainLayout.tsx
import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    // Cambiamos el fondo global a un gris muy claro (slate-50) y texto oscuro
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 w-screen overflow-hidden">
      
      {/* Encabezado Global: Blanco puro con sombra suave */}
      <header className="h-12 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-20 shadow-sm">
         
         <div className="flex items-center gap-4">
           <Link 
             to="/" 
             // Actualizamos el logo a un verde esmeralda profundo
             className="text-emerald-700 font-bold uppercase tracking-widest text-sm hover:text-emerald-600 transition-colors cursor-pointer"
           >
             Hñäki
           </Link>

           {location.pathname !== '/' && (
             <button
               onClick={() => navigate(-1)} 
               className="bg-white border border-slate-200 hover:border-emerald-300 text-slate-500 hover:text-emerald-600 p-1.5 rounded transition-all cursor-pointer shadow-sm group"
               title="Regresar"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                 <path d="m12 19-7-7 7-7"/>
                 <path d="M19 12H5"/>
               </svg>
             </button>
           )}
         </div>

         <div className="relative" ref={menuRef}>
           <button
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             // Botón de menú con estética de dashboard moderno (sin fuente mono)
             className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide flex items-center gap-2 transition-all cursor-pointer select-none shadow-sm"
           >
             MENU 
             <svg 
               xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
               className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
             >
               <path d="m6 9 6 6 6-6"/>
             </svg>
           </button>

           {isMenuOpen && (
             // Menú desplegable claro, con acentos esmeralda en hover
             <div className="absolute right-0 mt-2 w-52 rounded-md border border-slate-200 bg-white shadow-xl z-50 py-1 text-sm font-medium animate-fade-in">
               <Link to="/" className="block px-4 py-2.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors">
                 Dashboard Principal
               </Link>
               <Link to="/mapa" className="block px-4 py-2.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors">
                 Mapa / Indicadores
               </Link>
             </div>
           )}
         </div>

      </header>

      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};