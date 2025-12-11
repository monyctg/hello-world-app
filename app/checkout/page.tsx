'use client';

import { useCart } from '@/lib/store';
import { Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { placeOrder, verifyCoupon } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  const router = useRouter();
  useEffect(() => setIsMounted(true), []);

  // Calculate Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    toast.loading("Verifying...");
    const discount = await verifyCoupon(couponCode);
    toast.dismiss();

    if (discount) {
      setDiscountPercent(discount);
      setCouponMsg(`Success! ${discount}% Off applied.`);
      toast.success("Coupon Applied!");
    } else {
      setDiscountPercent(0);
      setCouponMsg("Invalid or expired code.");
      toast.error("Invalid Code");
    }
  };

const handleSuccess = async () => {
  try {
    toast.loading("Processing Order...");
    await placeOrder({
      name: formData.name,
      email: formData.email,
      total: total,
      items: cart,
      couponCode: discountPercent > 0 ? couponCode : null
    });
    toast.dismiss();
    toast.success("Order Placed Successfully!");
    clearCart();
    
    // CHANGED: Redirect to Thank You page
    router.push('/thank-you'); 
  } catch (error) {
    toast.error("Error saving order.");
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
            
            {/* LEFT: ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-6 p-4 bg-[#0e1011] border border-white/10 rounded-xl items-center">
                  <div className="w-20 h-20 bg-gray-900 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image || '/placeholder.jpg'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    {/* SHOW CUSTOM NOTE IF EXISTS */}
                    {item.customNote && <p className="text-xs text-blue-400 mt-1">Note: {item.customNote}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#14a800]">${item.price.toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline flex items-center gap-1 mt-1"><Trash2 size={14} /> Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: SUMMARY & PAYMENT */}
            <div className="bg-[#0e1011] p-8 rounded-2xl border border-white/10 h-fit sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="flex justify-between text-gray-400 mb-2"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              
              {/* COUPON INPUT */}
              <div className="my-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon Code" 
                    className="flex-1 p-2 bg-white/5 border border-white/10 rounded text-sm text-white uppercase"
                  />
                  <button onClick={handleApplyCoupon} className="bg-gray-800 text-white px-3 rounded text-sm hover:bg-gray-700">Apply</button>
                </div>
                {couponMsg && <p className={`text-xs mt-1 ${discountPercent > 0 ? 'text-green-500' : 'text-red-500'}`}>{couponMsg}</p>}
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-green-500 mb-2"><span>Discount</span><span>-${discountAmount.toFixed(2)}</span></div>
              )}

              <div className="flex justify-between text-xl font-bold text-white mb-8 border-t border-white/10 pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="space-y-4 mb-8">
                <input name="name" onChange={handleInputChange} className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" placeholder="Full Name" />
                <input name="email" onChange={handleInputChange} className="w-full p-3 bg-white/5 border border-white/10 rounded text-white" placeholder="Email Address" />
              </div>

              {/* CONDITIONAL PAYMENT BUTTONS */}
              {formData.name && formData.email ? (
                <>
                  {total === 0 ? (
                    // FREE ORDER BUTTON
                    <button 
                      onClick={handleSuccess}
                      className="w-full bg-[#14a800] text-white py-4 rounded font-bold hover:bg-[#118f00] transition"
                    >
                      Place Free Order
                    </button>
                  ) : (
                    // PAYPAL BUTTON
                    <PayPalScriptProvider options={{ clientId: "AcDbBJjcQINFFxHRLhVThmGS8t3C46YJnb45TEI6tTRBUiWpSnHCnJJKpJCk8tXDzK-_bi0WPp1C0s8n", currency: "USD" }}>
                      <PayPalButtons 
                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }} 
                        createOrder={(data, actions) => {
                          return actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { value: total.toString(), currency_code: "USD" } }] });
                        }}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            await actions.order.capture();
                            handleSuccess();
                          }
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                </>
              ) : (
                <button disabled className="w-full bg-gray-700 text-gray-400 py-3 rounded font-bold cursor-not-allowed">Enter Name & Email to Pay</button>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}