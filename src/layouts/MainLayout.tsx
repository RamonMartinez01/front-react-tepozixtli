// src/app/layouts/MainLayout.tsx
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

export const MainLayout = () => {
  // Control de estado para el despliegue del menú de navegación
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-slate-200 w-screen overflow-hidden">
      
      {/* Encabezado Global */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f0f0f] z-20 shadow-md">
         
         {/* Logo / Link Principal */}
         <Link 
            to="/" 
            className="text-cyan-500 font-bold uppercase tracking-widest text-sm hover:text-cyan-400 transition-colors cursor-pointer"
         >
           Hñäki
         </Link>

         {/* Contenedor del Menú Desplegable */}
         <div className="relative">
           <button
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="bg-[#121212] border border-slate-700 hover:border-slate-500 text-slate-300 px-4 py-2 rounded-md text-xs font-mono flex items-center gap-2 transition-all cursor-pointer select-none"
           >
             MENU 
             {/* Chevron SVG con rotación dinámica basada en el estado */}
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               width="14" 
               height="14" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
             >
               <path d="m6 9 6 6 6-6"/>
             </svg>
           </button>

           {/* Menú Flotante Absoluto (Solo se renderiza si isMenuOpen es verdadero) */}
           {isMenuOpen && (
             <div className="absolute right-0 mt-2 w-52 rounded border border-slate-800 bg-[#121212] shadow-2xl z-50 py-1 font-mono text-xs">
               
               <Link
                 to="/"
                 onClick={() => setIsMenuOpen(false)} // Cierra el menú tras la selección
                 className="block px-4 py-2.5 text-slate-400 hover:text-cyan-400 hover:bg-[#161616] transition-colors"
               >
                 &gt; Dashboard Principal
               </Link>
               
               <Link
                 to="/mapa"
                 onClick={() => setIsMenuOpen(false)}
                 className="block px-4 py-2.5 text-slate-400 hover:text-cyan-400 hover:bg-[#161616] transition-colors"
               >
                 &gt; Mapa / Indicadores
               </Link>

             </div>
           )}
         </div>

      </header>

      {/* Espacio de Inyección de Páginas */}
      <main className="flex-1 relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};