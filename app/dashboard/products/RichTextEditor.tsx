'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
// FIX: Import CSS from the NEW package
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import Quill to avoid "document is not defined" error in Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function RichTextEditor({ name, label, defaultValue = '' }: { name: string, label: string, defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);

  // Calculate Word Count (stripping HTML tags)
  const wordCount = value.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(w => w !== '').length;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold uppercase text-gray-500">{label}</label>
        <span className={`text-xs font-mono px-2 py-1 rounded ${wordCount > 1000 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {wordCount} words
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

      {/* Hidden Input to send data to Server Action */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}