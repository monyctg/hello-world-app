'use client';
import { useCart } from '@/lib/store';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function AddToCartBtn({ product, fullWidth = false }: { product: any, fullWidth?: boolean }) {
  const addToCart = useCart((state) => state.addToCart);
  const toggleCart = useCart((state) => state.toggleCart);

  const handleAdd = () => {
    addToCart(product);
    toast.success('Added to cart!');
    toggleCart(); // Open drawer
  };

  return (
    <button 
      onClick={handleAdd}
      className={`bg-[#14a800] hover:bg-[#118f00] text-white font-bold py-2 px-4 rounded transition flex items-center justify-center gap-2 ${fullWidth ? 'w-full py-4 text-lg' : ''}`}
    >
      <ShoppingCart size={18} />
      {fullWidth ? 'Buy Now' : 'Add'}
    </button>
  );
}