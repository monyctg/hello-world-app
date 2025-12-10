import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';
import AddToCartBtn from '../components/AddToCartBtn'; // We will create this
import CartDrawer from '../components/CartDrawer';     // We will create this

export const metadata: Metadata = {
  title: 'Store | Premium WordPress Plugins by Magfar',
  description: 'Buy high-quality, secure, and optimized WordPress plugins and licenses.',
};

export const dynamic = 'force-dynamic';

export default async function StorePage() {
  const products = await prisma.product.findMany();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#14a800] selection:text-white pt-24 pb-20 px-6">
      <CartDrawer />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Plugin Store</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Professional tools to power up your WordPress websites. Secure, fast, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-[#0e1011] border border-white/10 rounded-2xl overflow-hidden hover:border-[#14a800]/50 transition-all duration-300 flex flex-col">
              {/* Image */}
              <div className="h-48 bg-gray-900 relative overflow-hidden">
                {product.imageUrl ? (
                   <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold">No Image</div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#14a800]">${Number(product.price).toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Link href={`/store/${product.slug}`} className="px-4 py-2 text-sm border border-white/20 rounded hover:bg-white/10 transition">
                      Details
                    </Link>
                    <AddToCartBtn product={{
                      id: product.id,
                      title: product.title,
                      price: Number(product.price),
                      image: product.imageUrl || ''
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}