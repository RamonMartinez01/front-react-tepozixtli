// src/shared/ui/Select.tsx
import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

// Interfaz corregida con sus dos argumentos intactos
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
}

// Inyectamos <SelectProps> para que TypeScript conozca el contrato
export const Select: React.FC<SelectProps> = ({
  options,
  label,
  placeholder = '-- Seleccionar --',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-slate-500 text-[10px] uppercase block animate-fade-in">
          {label}
        </label>
      )}
      <select
        className="w-full bg-[#050505] border border-slate-700 text-slate-300 rounded p-2 focus:border-cyan-500 focus:outline-none transition-colors text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};