'use client';

import { useState } from 'react';
import { sendTestEmail } from '../actions';

export default function TestEmailPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTest = async (formData: FormData) => {
    setLoading(true);
    setStatus('Attempting to connect...');
    
    try {
      const result = await sendTestEmail(formData);
      if (result.success) {
        setStatus('✅ SUCCESS: Email sent! Check your inbox.');
      } else {
        setStatus(`❌ ERROR: ${result.message}`);
      }
    } catch (e) {
      setStatus('❌ CRITICAL FAILURE: Check Vercel Logs.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#111] border border-white/20 p-8 rounded-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">SMTP Debugger</h1>
        
        <form action={handleTest} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Send Test To:</label>
            <input 
              name="email" 
              type="email" 
              placeholder="your.email@gmail.com" 
              className="w-full p-3 bg-white/10 border border-white/10 rounded text-white mt-2" 
              required 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition disabled:opacity-50"
          >
            {loading ? 'Testing Connection...' : 'Send Test Email'}
          </button>
        </form>

        {status && (
          <div className={`mt-6 p-4 rounded text-sm border ${status.includes('SUCCESS') ? 'bg-green-900/50 border-green-500 text-green-200' : 'bg-red-900/50 border-red-500 text-red-200'}`}>
            {status}
          </div>
        )}
        
        <div className="mt-8 pt-4 border-t border-white/10 text-xs text-gray-500">
          <p><strong>Note:</strong> Check Vercel Function Logs for detailed error stack traces.</p>
        </div>
      </div>
    </div>
  );
}