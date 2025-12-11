import { prisma } from '@/lib/prisma';
import AddToCartBtn from '../../components/AddToCartBtn';
import CartDrawer from '../../components/CartDrawer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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
  const { slug } = await params; // Await the params here too
  
  // Use findFirst instead of findUnique (it's safer for url slugs)
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CartDrawer />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-gray-900 aspect-square relative shadow-2xl">
           <img 
             src={product.imageUrl || '/placeholder.jpg'} 
             alt={product.title} 
             className="w-full h-full object-cover" 
           />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="text-3xl font-bold text-[#14a800]">${Number(product.price).toFixed(2)}</div>
            <span className="bg-white/10 text-xs px-2 py-1 rounded text-gray-400">One-time payment</span>
          </div>
          
          <div className="prose prose-invert text-gray-300 mb-10 text-lg leading-relaxed">
  
  {/* OLD WAY: <p>{product.description}</p> */}
  
  {/* NEW WAY: Render HTML safely */}
  <div 
    dangerouslySetInnerHTML={{ __html: product.description }} 
    className="rich-text-content"
  />

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
            
            {product.demoLink && (
              <a 
                href={product.demoLink} 
                target="_blank" 
                className="w-full py-4 text-center border border-white/20 rounded font-bold hover:bg-white/5 transition"
              >
                View Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}