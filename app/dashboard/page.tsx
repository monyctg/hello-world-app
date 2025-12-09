import { prisma } from "@/lib/prisma";
import { updateText } from "../actions";

export default async function Dashboard() {
  const content = await prisma.content.findFirst();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500">Total Visits</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h3 className="text-gray-500">Current Status</h3>
          <p className="text-2xl font-bold text-green-600">Active</p>
        </div>
      </div>

      {/* UPDATE FORM */}
      <div className="bg-white p-6 rounded shadow max-w-xl">
        <h2 className="text-xl font-bold mb-4">Edit Homepage Content</h2>
        <form action={updateText} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Hero Text</label>
            <input
              name="newText"
              defaultValue={content?.text}
              className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter text..."
            />
          </div>
          <button className="bg-black text-white py-3 rounded hover:opacity-80 transition">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
