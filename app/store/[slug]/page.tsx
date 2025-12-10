import { prisma } from '@/lib/prisma';
import AddToCartBtn from '../../components/AddToCartBtn';
import CartDrawer from '../../components/CartDrawer';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: 'Not Found' };
  
  return {
    title: `${product.title} | Magfar Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
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
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CartDrawer />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-gray-900 aspect-square">
           <img src={product.imageUrl || '/placeholder.jpg'} alt={product.title} className="w-full h-full object-cover" />
        </div>

        {/* Right: Details */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
          <div className="text-3xl font-bold text-[#14a800] mb-8">${Number(product.price).toFixed(2)}</div>
          
          <div className="prose prose-invert text-gray-300 mb-8">
            <p>{product.description}</p>
            {product.features && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg whitespace-pre-wrap text-sm">
                <strong>Features included:</strong>
                <br/>
                {product.features}
              </div>
            )}
          </div>

          <div className="flex gap-4">
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