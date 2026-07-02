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
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-slate-600 text-xs font-medium uppercase tracking-wider block animate-fade-in">
          {label}
        </label>
      )}
      <select
        className="w-full bg-white border border-slate-300 text-slate-700 rounded-md py-2 px-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all text-sm shadow-sm cursor-pointer disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed hover:border-slate-400"
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};