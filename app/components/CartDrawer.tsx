'use client';
import { useCart } from '@/lib/store';
import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { placeOrder } from '@/app/actions';
import { toast } from 'sonner';

export default function CartDrawer() {
  const { cart, isOpen, toggleCart, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Simulate API call
    toast.loading("Processing order...");
    await placeOrder({
        name: formData.get('name'),
        email: formData.get('email'),
        total: total
    });
    
    toast.dismiss();
    toast.success("Order Placed Successfully!");
    clearCart();
    setIsCheckingOut(false);
    toggleCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleCart}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0e1011] border-l border-white/10 shadow-2xl h-full flex flex-col">
        <div className="p-6 border-b border-white/10 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Your Cart ({cart.length})</h2>
          <button onClick={toggleCart}><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-white/5 p-3 rounded">
                <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                    {item.image && <img src={item.image} className="w-full h-full object-cover"/>}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  <p className="text-[#14a800] text-sm">${item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500">
                    <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#050505]">
            <div className="flex justify-between text-xl font-bold text-white mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {isCheckingOut ? (
              <form onSubmit={handleCheckout} className="space-y-3 animate-fade-in">
                <input name="name" placeholder="Full Name" className="w-full p-3 bg-white/10 rounded text-white border border-white/10" required />
                <input name="email" type="email" placeholder="Email Address" className="w-full p-3 bg-white/10 rounded text-white border border-white/10" required />
                <button className="w-full bg-[#14a800] text-white py-3 rounded font-bold hover:bg-[#118f00]">
                  Confirm & Pay
                </button>
              </form>
            ) : (
              <button onClick={() => setIsCheckingOut(true)} className="w-full bg-white text-black py-3 rounded font-bold hover:bg-gray-200">
                Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}