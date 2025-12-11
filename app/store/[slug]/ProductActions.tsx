'use client';
import { useState, useMemo } from 'react';
import AddToCartBtn from '../../components/AddToCartBtn';

export default function ProductActions({ product }: { product: any }) {
  const variations = (product.variations && product.variations !== 'null') 
    ? JSON.parse(product.variations) 
    : [];

  // Get unique Plans available
  const availablePlans = Array.from(new Set(variations.map((v: any) => v.plan)));
  
  // State for selections
  const [selectedPlan, setSelectedPlan] = useState<string>(availablePlans[0] as string || '');
  const [selectedSites, setSelectedSites] = useState<string>('');

  // Get unique Sites available for the SELECTED Plan
  const availableSitesForPlan = useMemo(() => {
    return variations
      .filter((v: any) => v.plan === selectedPlan)
      .map((v: any) => v.sites);
  }, [selectedPlan, variations]);

  // Auto-select first site option when plan changes
  useMemo(() => {
    if (availableSitesForPlan.length > 0 && !availableSitesForPlan.includes(selectedSites)) {
      setSelectedSites(availableSitesForPlan[0]);
    }
  }, [availableSitesForPlan, selectedSites]);

  // Find the exact price for the combination
  const currentVariant = variations.find((v: any) => v.plan === selectedPlan && v.sites === selectedSites);
  
  const activePrice = currentVariant ? Number(currentVariant.price) : Number(product.price);
  const activeTitle = currentVariant 
    ? `${product.title} (${selectedPlan} - ${selectedSites})` 
    : product.title;

  return (
    <div>
      <div className="text-4xl font-bold text-[#14a800] mb-6">
        ${activePrice.toFixed(2)}
      </div>

      {variations.length > 0 && (
        <div className="mb-8 space-y-6">
          
          {/* 1. PLAN SELECTION */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-widest">Select Plan</label>
            <div className="flex flex-wrap gap-3">
              {availablePlans.map((plan: any) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`px-6 py-3 rounded-lg border font-medium transition ${
                    selectedPlan === plan 
                      ? 'border-[#14a800] bg-[#14a800] text-white' 
                      : 'border-white/10 bg-[#0e1011] text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          {/* 2. SITES SELECTION */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-widest">Number of Sites</label>
            <div className="flex flex-wrap gap-3">
              {availableSitesForPlan.map((site: any) => (
                <button
                  key={site}
                  onClick={() => setSelectedSites(site)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    selectedSites === site 
                      ? 'border-[#14a800] text-[#14a800] bg-[#14a800]/10' 
                      : 'border-white/10 bg-[#0e1011] text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {site}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      <div className="flex flex-col gap-4">
        <AddToCartBtn 
          product={{
            id: product.id, // For distinct cart items, you might append variant ID here in future
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