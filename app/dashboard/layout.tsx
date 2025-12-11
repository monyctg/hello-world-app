import Link from 'next/link';
import { logout } from '../actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  if (!cookieStore.has('admin_session')) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0e1011] text-white flex flex-col border-b md:border-b-0 md:border-r border-gray-800 shrink-0">
        
        {/* Logo Area */}
        <div className="p-4 md:p-6 text-xl md:text-2xl font-bold border-b border-gray-800 tracking-tighter flex justify-between items-center">
          <div>magfar<span className="text-[#14a800]">.</span></div>
          {/* Mobile Logout */}
          <form action={logout} className="md:hidden">
             <button className="text-red-400 text-xs font-bold uppercase border border-red-900 px-2 py-1 rounded">Log Out</button>
          </form>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-2 md:p-4 flex flex-row md:flex-col gap-2 text-sm font-medium text-gray-400 overflow-x-auto">
          <Link href="/dashboard" className="p-2 md:p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2 items-center whitespace-nowrap">
            <span>👤</span> <span className="hidden md:inline">Profile</span><span className="md:hidden">Profile</span>
          </Link>
          
          {/* --- NEW LINKS ADDED HERE --- */}
          <Link href="/dashboard/orders" className="p-2 md:p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2 items-center whitespace-nowrap text-blue-400 font-bold">
            <span>🛒</span> <span className="hidden md:inline">Orders</span><span className="md:hidden">Orders</span>
          </Link>
          <Link href="/dashboard/coupons" className="p-2 md:p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2 items-center whitespace-nowrap text-green-400 font-bold">
            <span>🎟️</span> <span className="hidden md:inline">Coupons</span><span className="md:hidden">Coupons</span>
          </Link>
          {/* --------------------------- */}

          <Link href="/dashboard/products" className="p-2 md:p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2 items-center whitespace-nowrap">
            <span>📦</span> <span className="hidden md:inline">Products</span><span className="md:hidden">Products</span>
          </Link>
          <Link href="/dashboard/testimonials" className="p-2 md:p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2 items-center whitespace-nowrap">
            <span>⭐</span> <span className="hidden md:inline">Testimonials</span><span className="md:hidden">Reviews</span>
          </Link>
          <Link href="/dashboard/projects" className="p-2 md:p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2 items-center whitespace-nowrap">
            <span>🚀</span> <span className="hidden md:inline">Projects</span><span className="md:hidden">Projects</span>
          </Link>
          <Link href="/dashboard/skills" className="p-2 md:p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2 items-center whitespace-nowrap">
            <span>⚡</span> <span className="hidden md:inline">Skills</span><span className="md:hidden">Skills</span>
          </Link>
        </nav>

        {/* Desktop Footer */}
        <div className="hidden md:block p-4 border-t border-gray-800">
          <Link href="/" target="_blank" className="block text-center p-2 mb-2 bg-[#14a800] text-white rounded font-bold text-xs hover:bg-[#108a00]">
            View Live Site
          </Link>
          <form action={logout}>
            <button className="w-full text-center p-2 text-red-400 hover:text-red-300 text-xs uppercase tracking-widest">
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-130px)] md:h-screen bg-gray-50">
        {children}
      </main>
    </div>
  );
}