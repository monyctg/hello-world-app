import { prisma } from '@/lib/prisma';
import { addProduct, deleteProduct } from '../../actions';
import RichTextEditor from './RichTextEditor';
import VariationsEditor from './VariationsEditor';
import TitleInput from './TitleInput';
import Link from 'next/link';

export default async function DashboardProducts() {
  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });

  return (
    <div className="max-w-5xl mx-auto p-8 pb-24 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Product Manager</h1>

      {/* --- ADD PRODUCT FORM --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h2 className="font-bold text-lg mb-4 text-blue-600">Add New Product</h2>
        <form action={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <TitleInput name="title" label="Product Title" required />
          </div>

          <div>
             <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Base Price ($)</label>
             <input name="price" type="number" step="0.01" className="w-full p-3 border rounded text-black bg-white" required />
          </div>
          
          <div>
             <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Official Link</label>
             <input name="officialLink" className="w-full p-3 border rounded text-black bg-white" placeholder="https://..." />
          </div>

          {/* FOCUS KEYWORD */}
          <div className="md:col-span-2">
             <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Focus Keyword (SEO)</label>
             <input name="focusKeyword" className="w-full p-3 border rounded bg-blue-50 text-black" placeholder="e.g. WordPress Plugin" />
          </div>

          {/* VARIATIONS EDITOR */}
          <div className="md:col-span-2">
             <VariationsEditor />
          </div>

          <div className="md:col-span-2">
            <RichTextEditor name="description" label="Product Description" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Features (Sidebar List)</label>
            <textarea name="features" className="w-full p-3 border rounded h-24 text-black bg-white" placeholder="e.g. 1 Year Support..." />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Product Image</label>
            <input type="file" name="imageFile" accept="image/*" className="w-full text-sm text-gray-500" />
          </div>

          <button className="md:col-span-2 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">
            Create Product
          </button>
        </form>
      </div>

      {/* --- PRODUCT LIST (With Edit Button) --- */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded border flex justify-between items-center text-gray-900">
            <div className="flex items-center gap-4">
              {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded" />}
              <div>
                <h3 className="font-bold">{p.title}</h3>
                <div className="flex gap-2 text-sm text-gray-500">
                   <span>${Number(p.price).toFixed(2)}</span>
                   {p.focusKeyword && <span className="bg-blue-100 text-blue-800 px-2 rounded text-xs flex items-center">{p.focusKeyword}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {/* EDIT LINK */}
              <Link href={`/dashboard/products/edit/${p.id}`} className="px-3 py-1 bg-gray-100 text-blue-600 rounded text-sm font-bold hover:bg-gray-200">
                Edit
              </Link>
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={p.id} />
                <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}