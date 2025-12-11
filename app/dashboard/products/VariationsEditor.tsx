'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// New structure: Plan + Sites + Price
type Variation = {
  plan: string;
  sites: string;
  price: string;
};

const PLAN_OPTIONS = ["1 Year", "5 Years", "Lifetime", "Custom"];
const SITE_OPTIONS = ["1 Site", "5 Sites", "10 Sites", "Unlimited Sites", "Custom"];

export default function VariationsEditor({ defaultValue }: { defaultValue?: string }) {
  const [variations, setVariations] = useState<Variation[]>([]);

  useEffect(() => {
    if (defaultValue) {
      try {
        const parsed = JSON.parse(defaultValue);
        // Ensure backward compatibility or empty
        if (Array.isArray(parsed)) setVariations(parsed);
      } catch (e) { setVariations([]); }
    }
  }, [defaultValue]);

  const addRow = () => {
    setVariations([...variations, { plan: '1 Year', sites: '1 Site', price: '' }]);
  };

  const removeRow = (index: number) => {
    const newList = [...variations];
    newList.splice(index, 1);
    setVariations(newList);
  };

  const updateRow = (index: number, field: keyof Variation, value: string) => {
    const newList = [...variations];
    newList[index][field] = value;
    setVariations(newList);
  };

  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <label className="text-xs font-bold uppercase text-gray-500">Pricing Matrix</label>
        <button type="button" onClick={addRow} className="text-xs bg-blue-100 text-blue-600 px-3 py-2 rounded font-bold flex items-center gap-1">
          <Plus size={14} /> Add Price Option
        </button>
      </div>

      {variations.length === 0 && (
        <p className="text-xs text-gray-400 italic mb-2">No variations. Base price applies.</p>
      )}

      <div className="space-y-3">
        {variations.map((v, i) => (
          <div key={i} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-white p-2 rounded border shadow-sm">
            
            {/* PLAN DROPDOWN */}
            <select 
              value={v.plan} 
              onChange={(e) => updateRow(i, 'plan', e.target.value)}
              className="p-2 border rounded text-sm text-black bg-white flex-1 w-full md:w-auto"
            >
              {PLAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            {/* SITES DROPDOWN */}
            <select 
              value={v.sites} 
              onChange={(e) => updateRow(i, 'sites', e.target.value)}
              className="p-2 border rounded text-sm text-black bg-white flex-1 w-full md:w-auto"
            >
              {SITE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            {/* PRICE INPUT */}
            <div className="relative w-full md:w-32">
              <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
              <input 
                type="number" 
                placeholder="0.00"
                value={v.price}
                onChange={(e) => updateRow(i, 'price', e.target.value)}
                className="w-full p-2 pl-6 border rounded text-sm text-black bg-white"
                required
              />
            </div>

            <button type="button" onClick={() => removeRow(i)} className="p-2 text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <input type="hidden" name="variations" value={JSON.stringify(variations)} />
    </div>
  );
}