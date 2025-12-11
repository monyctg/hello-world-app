'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type Variation = {
  name: string;
  price: string;
};

export default function VariationsEditor({ defaultValue }: { defaultValue?: string }) {
  const [variations, setVariations] = useState<Variation[]>([]);

  // Load existing data if editing
  useEffect(() => {
    if (defaultValue) {
      try {
        setVariations(JSON.parse(defaultValue));
      } catch (e) {
        setVariations([]);
      }
    }
  }, [defaultValue]);

  const addRow = () => {
    setVariations([...variations, { name: '', price: '' }]);
  };

  const removeRow = (index: number) => {
    const newList = [...variations];
    newList.splice(index, 1);
    setVariations(newList);
  };

  const updateRow = (index: number, field: 'name' | 'price', value: string) => {
    const newList = [...variations];
    newList[index][field] = value;
    setVariations(newList);
  };

  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <label className="text-xs font-bold uppercase text-gray-500">License Variations</label>
        <button type="button" onClick={addRow} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold flex items-center gap-1">
          <Plus size={12} /> Add Variation
        </button>
      </div>

      {variations.length === 0 && (
        <p className="text-xs text-gray-400 italic mb-2">No variations added. Base price will be used.</p>
      )}

      <div className="space-y-2">
        {variations.map((v, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input 
              placeholder="e.g. Unlimited Sites - Lifetime"
              value={v.name}
              onChange={(e) => updateRow(i, 'name', e.target.value)}
              className="flex-1 p-2 border rounded text-sm text-black"
              required
            />
            <input 
              type="number" 
              placeholder="Price"
              value={v.price}
              onChange={(e) => updateRow(i, 'price', e.target.value)}
              className="w-24 p-2 border rounded text-sm text-black"
              required
            />
            <button type="button" onClick={() => removeRow(i)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Hidden input to send JSON string to server */}
      <input type="hidden" name="variations" value={JSON.stringify(variations)} />
    </div>
  );
}