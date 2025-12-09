import Link from "next/link";
import { logout } from "../actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. Make the component async
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Await the cookies function
  const cookieStore = await cookies();

  // 3. Check using the awaited variable
  if (!cookieStore.has("admin_session")) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-800">
          My App
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="p-3 bg-gray-800 rounded hover:bg-gray-700"
          >
            🏠 Dashboard
          </Link>
          <Link
            href="/"
            target="_blank"
            className="p-3 hover:bg-gray-800 rounded"
          >
            👀 View Live Site
          </Link>
        </nav>
        <form action={logout} className="p-4 border-t border-gray-800">
          <button className="w-full text-left p-2 text-red-400 hover:text-red-300">
            Log Out
          </button>
        </form>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-auto p-8 text-black">{children}</main>
    </div>
  );
}
