import { prisma } from '@/lib/prisma';
import { addProduct, deleteProduct } from '../../actions';

export default async function DashboardProducts() {
  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });

  return (
    <div className="max-w-5xl mx-auto p-8 pb-24">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Product Manager</h1>

      {/* ADD PRODUCT FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h2 className="font-bold text-lg mb-4 text-blue-600">Add Digital Product</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">Product Title</label>
            <input name="title" className="w-full p-3 border rounded" required />
          </div>

          <div>
             <label className="text-xs font-bold uppercase text-gray-500">Price ($)</label>
             <input name="price" type="number" step="0.01" className="w-full p-3 border rounded" required />
          </div>
          
          <div>
             <label className="text-xs font-bold uppercase text-gray-500">Demo Link (Optional)</label>
             <input name="demoLink" className="w-full p-3 border rounded" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description (SEO)</label>
            <textarea name="description" className="w-full p-3 border rounded h-24" required />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">Features (List items)</label>
            <textarea name="features" className="w-full p-3 border rounded h-24" placeholder="e.g. 1 Year Support, Unlimited Sites..." />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500">Product Image</label>
            <input type="file" name="imageFile" accept="image/*" className="w-full text-sm text-gray-500" />
          </div>

          <button className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">
            Create Product
          </button>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded border flex justify-between items-center">
            <div className="flex items-center gap-4">
              {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded" />}
              <div>
                <h3 className="font-bold">{p.title}</h3>
                <p className="text-sm text-gray-500">${Number(p.price).toFixed(2)}</p>
              </div>
            </div>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={p.id} />
              <button className="text-red-500 text-sm hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}