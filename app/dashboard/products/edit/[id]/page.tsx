import { prisma } from '@/lib/prisma';
import { updateProduct } from '@/app/actions';
import RichTextEditor from '../../RichTextEditor';
import VariationsEditor from '../../VariationsEditor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

// IMPORTANT: This must be 'export default'
export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  
  // Ensure ID is valid
  if (!id) return notFound();

  const product = await prisma.product.findUnique({ 
    where: { id: parseInt(id) } 
  });

  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 pb-24 text-black">
      <Link href="/dashboard/products" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Product: {product.title}</h1>

      <form action={updateProduct} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="hidden" name="id" value={product.id} />
        
        <div className="md:col-span-2">
           <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Product Title</label>
           <input name="title" defaultValue={product.title} className="w-full p-3 border rounded text-black font-bold" required />
        </div>

        <div>
           <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Base Price ($)</label>
           <input name="price" type="number" step="0.01" defaultValue={Number(product.price)} className="w-full p-3 border rounded text-black" required />
        </div>
        
        <div>
           <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Official Website Link</label>
           <input name="officialLink" defaultValue={product.officialLink || ''} className="w-full p-3 border rounded text-black" />
        </div>

        <div className="md:col-span-2">
           <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Focus Keyword (SEO)</label>
           <input name="focusKeyword" defaultValue={product.focusKeyword || ''} className="w-full p-3 border rounded bg-blue-50 text-black" placeholder="e.g. WordPress SEO Plugin" />
        </div>

        <div className="md:col-span-2">
           {/* VARIATIONS EDITOR */}
           <VariationsEditor defaultValue={product.variations || ''} />
        </div>

        <div className="md:col-span-2">
           <RichTextEditor name="description" label="Product Description" defaultValue={product.description} />
        </div>

        <div className="md:col-span-2">
           <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Features List</label>
           <textarea name="features" defaultValue={product.features || ''} className="w-full p-3 border rounded h-24 text-black" />
        </div>

        <div className="md:col-span-2 p-4 bg-gray-50 rounded border">
           <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Update Image (Leave empty to keep current)</label>
           <div className="flex gap-4 items-center">
             {product.imageUrl && <img src={product.imageUrl} className="w-16 h-16 rounded object-cover" alt="Current" />}
             <input type="hidden" name="imageUrl" value={product.imageUrl || ''} />
             <input type="file" name="imageFile" accept="image/*" className="text-sm" />
           </div>
        </div>

        <button className="md:col-span-2 bg-blue-600 text-white py-4 rounded font-bold hover:bg-blue-700 text-lg">
          Update Product
        </button>
      </form>
    </div>
  );
}