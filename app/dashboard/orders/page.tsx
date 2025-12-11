import { prisma } from '@/lib/prisma';
import { updateOrderStatus } from '../../actions';

export default async function DashboardOrders() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  const statusColors: any = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Complete': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Refunded': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50 border-b text-gray-500 uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Items / Note</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono">#{order.id}</td>
                <td className="p-4">
                  <div className="font-bold">{order.customerName}</div>
                  <div className="text-gray-500 text-xs">{order.email}</div>
                </td>
                <td className="p-4 font-bold">${Number(order.total).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[order.status] || 'bg-gray-100'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-600 max-w-xs">
                  {order.items ? JSON.parse(order.items).map((i: any, idx: number) => (
                    <div key={idx} className="mb-1">
                      • {i.title} 
                      {i.customNote && <span className="text-blue-600 block pl-2 italic">Note: {i.customNote}</span>}
                    </div>
                  )) : '-'}
                  {order.couponCode && <div className="text-green-600 mt-1 font-bold">Coupon: {order.couponCode}</div>}
                </td>
                <td className="p-4">
                  <form action={updateOrderStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <select name="status" defaultValue={order.status} className="border rounded p-1 text-xs bg-white text-black">
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Complete</option>
                      <option>Cancelled</option>
                      <option>Refunded</option>
                    </select>
                    <button className="bg-black text-white px-2 py-1 rounded text-xs">Save</button>
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