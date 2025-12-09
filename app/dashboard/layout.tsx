import Link from "next/link";
import { logout } from "../actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  if (!cookieStore.has("admin_session")) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0e1011] text-white flex flex-col border-r border-gray-800">
        <div className="p-6 text-2xl font-bold border-b border-gray-800 tracking-tighter">
          magfar<span className="text-[#14a800]">.</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2 text-sm font-medium text-gray-400">
          <Link
            href="/dashboard"
            className="p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2"
          >
            👤 Profile & Photo
          </Link>
          <Link
            href="/dashboard/testimonials"
            className="p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2"
          >
            ⭐ Testimonials
          </Link>
          <Link
            href="/dashboard/projects"
            className="p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2"
          >
            🚀 Projects
          </Link>
          <Link
            href="/dashboard/skills"
            className="p-3 hover:bg-gray-800 hover:text-white rounded transition flex gap-2"
          >
            ⚡ Skills
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link
            href="/"
            target="_blank"
            className="block text-center p-2 mb-2 bg-[#14a800] text-white rounded font-bold text-xs hover:bg-[#108a00]"
          >
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
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
