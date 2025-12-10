import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 bg-[#050505] text-center text-white font-sans">
      <div className="flex justify-center gap-8 mb-8 text-sm font-bold text-gray-400">
         <Link href="/store" className="hover:text-[#14a800] transition-colors">Store</Link>
         <Link href="/dashboard" className="hover:text-white transition-colors">Admin</Link>
      </div>
      <p className="text-gray-600 text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Magfar. All rights reserved.
      </p>
    </footer>
  );
}