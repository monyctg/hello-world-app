import { prisma } from '@/lib/prisma';
import { addCoupon, deleteCoupon } from '../../actions';

export default async function DashboardCoupons() {
  const coupons = await prisma.coupon.findMany({ orderBy: { id: 'desc' } });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 pb-24 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Coupon Manager</h1>

      {/* Add Coupon   */}
      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="font-bold text-lg mb-4 text-purple-600">Create New Coupon</h2>
        <form action={addCoupon} className="flex gap-4">
          <input name="code" placeholder="Code (e.g. SAVE20)" className="p-3 border rounded flex-1 uppercase text-black bg-white" required />
          <input name="discount" type="number" placeholder="Discount %" className="p-3 border rounded w-32 text-black bg-white" required />
          <button className="bg-purple-600 text-white px-6 rounded font-bold hover:bg-purple-700">Create</button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold">Code</th>
              <th className="p-4 font-bold">Discount</th>
              <th className="p-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-mono font-bold text-green-600">{c.code}</td>
                <td className="p-4">{c.discount}% Off</td>
                <td className="p-4">
                  <form action={deleteCoupon}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-red-500 hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}