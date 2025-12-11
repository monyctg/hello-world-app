'use client';
import { useState } from 'react';
import AddToCartBtn from '../../components/AddToCartBtn';

export default function ProductActions({ product }: { product: any }) {
  const variations = product.variations ? JSON.parse(product.variations) : [];
  const [selectedVar, setSelectedVar] = useState(variations.length > 0 ? variations[0] : null);

  const activePrice = selectedVar ? Number(selectedVar.price) : Number(product.price);
  const activeTitle = selectedVar ? `${product.title} (${selectedVar.name})` : product.title;

  return (
    <div>
      <div className="text-3xl font-bold text-[#14a800] mb-6">
        ${activePrice.toFixed(2)}
      </div>

      {variations.length > 0 && (
        <div className="mb-8">
          <label className="text-sm font-bold text-gray-400 mb-2 block uppercase">Select License</label>
          <div className="flex flex-col gap-2">
            {variations.map((v: any, idx: number) => (
              <label 
                key={idx} 
                className={`flex justify-between items-center p-4 rounded-lg border cursor-pointer transition ${
                  selectedVar.name === v.name 
                    ? 'border-[#14a800] bg-[#14a800]/10 text-white' 
                    : 'border-white/10 hover:bg-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="variation" 
                    checked={selectedVar.name === v.name} 
                    onChange={() => setSelectedVar(v)}
                    className="accent-[#14a800]"
                  />
                  <span className="font-medium">{v.name}</span>
                </div>
                <span className="font-bold">${v.price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <AddToCartBtn 
          product={{
            id: product.id, // Note: You might want unique IDs for variations in a real app
            title: activeTitle,
            price: activePrice,
            image: product.imageUrl || ''
          }} 
          fullWidth={true}
        />
        
        {product.officialLink && (
          <a 
            href={product.officialLink} 
            target="_blank" 
            className="w-full py-4 text-center border border-white/20 rounded font-bold hover:bg-white/5 transition"
          >
            Visit Official Website
          </a>
        )}
      </div>
    </div>
  );
}