'use client';
import { useState } from 'react';

export default function TitleInput({ name, label, required = false }: { name: string, label: string, required?: boolean }) {
  const [value, setValue] = useState('');

  const wordCount = value.trim().split(/\s+/).filter(w => w !== '').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-bold uppercase text-gray-500">{label}</label>
        <span className="text-xs text-gray-400">{wordCount} words</span>
      </div>
      <input 
        name={name} 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white" 
        required={required}
      />
    </div>
  );
}