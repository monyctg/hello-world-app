'use client';
import { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { customerLogin, customerSignup } from '@/app/actions';
import { toast } from 'sonner';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (isLogin) {
        await customerLogin(formData);
        toast.success("Welcome back!");
      } else {
        await customerSignup(formData);
        toast.success("Account created! Please login.");
        setIsLogin(true); // Switch to login view
        setLoading(false);
        return;
      }
      onClose();
    } catch (error) {
      toast.error("Authentication failed. Check details.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-[#0e1011] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          {isLogin ? 'Login to access your purchases' : 'Join to buy plugins & licenses'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />
              <input name="name" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 text-white text-sm focus:border-[#14a800] outline-none" required />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
            <input name="email" type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 text-white text-sm focus:border-[#14a800] outline-none" required />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
            <input name="password" type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 text-white text-sm focus:border-[#14a800] outline-none" required />
          </div>

          <button disabled={loading} className="w-full bg-[#14a800] hover:bg-[#118f00] text-white font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#14a800] hover:underline font-bold">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}