import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AddToCartBtn from './components/AddToCartBtn';
import CartDrawer from './components/CartDrawer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await prisma.content.findFirst();
  const skills = await prisma.skill.findMany();
  const testimonials = await prisma.testimonial.findMany();
  const projects = await prisma.project.findMany({ orderBy: { id: 'desc' } });
  
  // FETCH LATEST 6 PRODUCTS
  const latestProducts = await prisma.product.findMany({ 
    take: 6, 
    orderBy: { createdAt: 'desc' } 
  });

  const defaultSkills = ["WordPress", "Shopify", "React", "Next.js", "Node.js", "Security", "SEO"];

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#14a800] selection:text-white font-sans">
      <CartDrawer />
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#14a800] rounded-full blur-[120px] opacity-[0.08]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-[0.05]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* --- PREMIUM STORE SECTION (UPDATED) --- */}
      <section className="py-24 px-6 border-y border-white/5 bg-[#080808] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">Digital Products</h2>
              <p className="text-gray-400">Premium WordPress plugins & licenses.</p>
            </div>
            <Link href="/store" className="text-[#14a800] font-bold hover:text-white transition flex items-center gap-2">
              View All Products →
            </Link>
          </div>

          {latestProducts.length === 0 ? (
            <div className="p-10 border border-dashed border-white/20 rounded-2xl text-center text-gray-500">
              Products coming soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestProducts.map((product) => (
                <div key={product.id} className="group bg-[#0e1011] border border-white/10 rounded-2xl overflow-hidden hover:border-[#14a800]/50 transition-all duration-300 flex flex-col">
                  {/* Image */}
                  <Link href={`/store/${product.slug}`} className="h-48 bg-gray-900 relative overflow-hidden block">
                    {product.imageUrl ? (
                       <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold">No Image</div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <Link href={`/store/${product.slug}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-[#14a800] transition-colors">{product.title}</h3>
                    </Link>
                    
                    {/* --- FIX: STRIP HTML TAGS --- */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-[#14a800]">${Number(product.price).toFixed(2)}</span>
                      <div className="flex gap-2">
                         <Link href={`/store/${product.slug}`} className="px-3 py-2 text-xs border border-white/20 rounded hover:bg-white/10">Details</Link>
                         <AddToCartBtn product={{ id: product.id, title: product.title, price: Number(product.price), image: product.imageUrl || '' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* (Rest of page.tsx remains mostly the same, just ensure this section above is updated) */}
      {/* ... Hero, Projects, Testimonials, Footer ... */}
      
      {/* --- HERO SECTION (Keeping content for completeness) --- */}
      <section className="relative z-10 pt-44 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {content?.location || "Available for Work"}
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">{content?.text || "Expert Developer"}</h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mx-auto md:mx-0">{content?.subtext}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Link href="/store" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">Browse Store</Link>
              <a href="#work" className="px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors">View Projects</a>
            </div>
          </div>
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
              <img src={content?.imageUrl || '/me.png'} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* --- PROJECTS GRID --- */}
      <section id="work" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-4xl md:text-5xl font-bold mb-16">Selected Work</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <a href={project.link || '#'} target="_blank" key={project.id} className="group relative bg-[#0e1011] border border-white/10 rounded-2xl overflow-hidden hover:border-[#14a800]/50 transition-all duration-300">
                <div className="p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#14a800] transition-colors">{project.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">{project.description}</p>
                  </div>
                  <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.split(',').map((tech, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-white/5 px-2 py-1 rounded">{tech.trim()}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* --- SKILLS & TESTIMONIALS (Simplified for brevity, keep your existing code) --- */}
       <section id="skills" className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-[#14a800] tracking-widest uppercase mb-8">Technical Expertise</p>
          <div className="flex flex-wrap justify-center gap-3">
            {(skills.length > 0 ? skills.map(s => s.name) : defaultSkills).map((skill, i) => (
              <span key={i} className="px-6 py-3 rounded-xl bg-[#0e1011] border border-white/10 text-gray-300 text-sm font-medium hover:border-[#14a800] hover:text-[#14a800] hover:bg-[#14a800]/5 transition-all cursor-default">{skill}</span>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonials" className="py-32 px-6 bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Client Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-[#0e1011] p-8 rounded-2xl border border-white/5 relative">
                <div className="text-[#14a800] text-xl mb-4">★★★★★</div>
                <p className="text-gray-300 mb-8 leading-relaxed">"{t.review}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-sm">{t.client.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-sm text-white">{t.client}</p>
                    <p className="text-xs text-gray-500">Verified Client</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}