'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function RichTextEditor({ name, label, defaultValue = '' }: { name: string, label: string, defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);

  // CHANGED: Strip HTML tags and count characters
  const plainText = value.replace(/<[^>]*>/g, '');
  const charCount = plainText.length;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold uppercase text-gray-500">{label}</label>
        <span className={`text-xs font-mono px-2 py-1 rounded ${charCount > 5000 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {charCount} chars
        </span>
      </div>
      
      <div className="bg-white text-black">
        <ReactQuill 
          theme="snow" 
          value={value} 
          onChange={setValue} 
          className="h-64 mb-12" 
          modules={{
            toolbar: [
              [{ 'header': [2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'clean']
            ],
          }}
        />
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}