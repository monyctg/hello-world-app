'use client';

import { useCart } from '@/lib/store';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { placeOrder } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '' });
  const router = useRouter();

  // Prevent hydration errors
  useEffect(() => setIsMounted(true), []);

  // Calculate Total
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // Handle Form Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Successful Payment
  const handlePaymentSuccess = async (details: any) => {
    try {
      toast.loading("Processing Order...");
      
      // Save order to database via Server Action
      await placeOrder({
        name: formData.name || details.payer.name.given_name,
        email: formData.email || details.payer.email_address,
        total: total
      });

      toast.dismiss();
      toast.success("Payment Successful! License sent to email.");
      clearCart();
      router.push('/store'); // Redirect back to store
    } catch (error) {
      toast.error("Something went wrong saving the order.");
    }
  };

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
          <ShoppingBag className="text-[#14a800]" /> Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-[#0e1011] rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <Link href="/store" className="px-6 py-3 bg-[#14a800] text-white rounded font-bold hover:bg-[#118f00]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-6 p-4 bg-[#0e1011] border border-white/10 rounded-xl items-center">
                  <div className="w-20 h-20 bg-gray-900 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image || '/placeholder.jpg'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-400 text-sm">License Key</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#14a800]">${item.price.toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-red-500 text-sm hover:underline flex items-center gap-1 mt-1"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: CHECKOUT FORM */}
            <div className="bg-[#0e1011] p-8 rounded-2xl border border-white/10 h-fit sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white mb-8 border-t border-white/10 pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* INPUT FIELDS */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                  <input 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded text-white focus:border-[#14a800] outline-none transition" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                  <input 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded text-white focus:border-[#14a800] outline-none transition" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              {/* PAYPAL BUTTONS */}
              {formData.name && formData.email ? (
                <PayPalScriptProvider options={{ 
                  clientId: "BA_YOUR_SANDBOX_CLIENT_ID_HERE", // REPLACE THIS LATER
                  currency: "USD" 
                }}>
                  <PayPalButtons 
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }} 
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          amount: { value: total.toString(), currency_code: "USD" }
                        }]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (actions.order) {
                        const details = await actions.order.capture();
                        handlePaymentSuccess(details);
                      }
                    }}
                  />
                </PayPalScriptProvider>
              ) : (
                <button disabled className="w-full bg-gray-700 text-gray-400 py-3 rounded font-bold cursor-not-allowed">
                  Enter Name & Email to Pay
                </button>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                By purchasing, you agree to our terms. Secure payment via PayPal.
              </p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}