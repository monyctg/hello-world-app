import { prisma } from '@/lib/prisma';
import AddToCartBtn from '../../components/AddToCartBtn';
import CartDrawer from '../../components/CartDrawer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import ProductActions from './ProductActions'; // Import the new component

// 1. Define Props for Next.js 15 (Params is a Promise now)
type Props = {
  params: Promise<{ slug: string }>;
};

// 2. Fix Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // Await the params
  const product = await prisma.product.findFirst({ where: { slug: slug } });
  
  if (!product) return { title: 'Not Found' };
  
  return {
    title: `${product.title} | Magfar Store`,
    description: product.description,
  };
}


// 3. Fix Main Page Component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({ where: { slug: slug } });
  if (!product) notFound();

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imageUrl,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

    return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-sans">
      {/* ... keep scripts and cart drawer ... */}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-gray-900 aspect-square relative shadow-2xl">
           <img src={product.imageUrl || '/placeholder.jpg'} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.title}</h1>
          
          {/* REPLACE OLD PRICE/BUTTONS WITH NEW ACTIONS COMPONENT */}
          <ProductActions product={product} />
          
          <div className="prose prose-invert text-gray-300 mt-10 text-lg leading-relaxed">
             <div dangerouslySetInnerHTML={{ __html: product.description }} className="rich-text-content" />

  {product.features && (
    <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/5 text-sm">
                <strong className="block text-white mb-2 text-base">What's included:</strong>
                <div className="whitespace-pre-wrap text-gray-400">
                  {product.features}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <AddToCartBtn 
              product={{
                id: product.id,
                title: product.title,
                price: Number(product.price),
                image: product.imageUrl || ''
              }} 
              fullWidth={true}
            />
            
          </div>
        </div>
      </div>
    </main>
  );
}