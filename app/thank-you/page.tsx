import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="bg-[#0e1011] border border-white/10 p-10 rounded-3xl max-w-lg text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 animate-bounce-slow">
            <CheckCircle size={48} />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Thank you for your purchase. We have sent the license keys and download links to your email address.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/store" className="w-full bg-[#14a800] hover:bg-[#118f00] text-white py-4 rounded-xl font-bold transition">
            Continue Shopping
          </Link>
          <Link href="/" className="w-full py-4 rounded-xl font-bold text-gray-500 hover:text-white transition">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}