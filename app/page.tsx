import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await prisma.content.findFirst();
  const skills = await prisma.skill.findMany();
  const testimonials = await prisma.testimonial.findMany();
  const projects = await prisma.project.findMany();

  // Fallback data (Using your Upwork info) if DB is empty
  const defaultSkills = [
    "WordPress",
    "Shopify",
    "Joomla",
    "Magento",
    "HTML",
    "Website Security",
    "SEO",
    "Zapier",
    "CSS",
  ];

  return (
    <main className="min-h-screen bg-[#0e1011] text-white selection:bg-[#14a800] selection:text-white">
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-[#0e1011]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">
            magfar<span className="text-[#14a800]">.</span>
          </div>
          <a
            href={
              content?.upworkLink ||
              "https://www.upwork.com/freelancers/~019c9872d9fceebb74"
            }
            target="_blank"
            className="bg-[#14a800] hover:bg-[#108a00] text-white px-6 py-2 rounded-full font-bold transition shadow-lg shadow-green-900/20"
          >
            Hire Me
          </a>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Left Text */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {content?.location || "Chittagong, Bangladesh"}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {content?.text || "Expert WordPress Developer"}
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
              {content?.subtext ||
                "With over 14 years of experience, I specialize in creating, customizing, and securing websites that help businesses grow."}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex flex-col border-l-2 border-[#14a800] pl-4">
                <span className="text-3xl font-bold text-white">
                  {content?.statNumber || "100%"}
                </span>
                <span className="text-sm text-gray-500 uppercase">
                  Job Success
                </span>
              </div>
              <div className="flex flex-col border-l-2 border-white/20 pl-4">
                <span className="text-3xl font-bold text-white">94+</span>
                <span className="text-sm text-gray-500 uppercase">
                  Total Jobs
                </span>
              </div>
              <div className="flex flex-col border-l-2 border-white/20 pl-4">
                <span className="text-3xl font-bold text-white">
                  {content?.hourlyRate || "$50.00/hr"}
                </span>
                <span className="text-sm text-gray-500 uppercase">Rate</span>
              </div>
            </div>

            <div className="pt-8">
              <a
                href={content?.upworkLink || "#"}
                target="_blank"
                className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition"
              >
                View Upwork Profile
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#14a800] to-blue-600 rounded-full blur-[100px] opacity-20"></div>
              <img
                src={content?.imageUrl || "/me.jpg"}
                alt="Magfar Profile"
                className="relative w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl bg-gray-900"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Technical Expertise
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {(skills.length > 0
              ? skills.map((s) => s.name)
              : defaultSkills
            ).map((skill, i) => (
              <span
                key={i}
                className="px-5 py-2 rounded-full bg-[#0e1011] border border-white/10 text-gray-300 hover:border-[#14a800] hover:text-[#14a800] transition cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
          <span className="w-8 h-1 bg-[#14a800] rounded"></span>
          Client Feedback
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.length > 0 ? (
            testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-[#161819] p-8 rounded-xl border border-white/5 hover:border-white/10 transition"
              >
                <div className="flex text-[#14a800] mb-4">
                  ★★★★★{" "}
                  <span className="text-gray-600 ml-2 text-sm">{t.rating}</span>
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">
                  "{t.review}"
                </p>
                <p className="font-bold text-white text-sm">{t.client}</p>
              </div>
            ))
          ) : (
            // FALLBACK TESTIMONIALS (From your prompt)
            <>
              <div className="bg-[#161819] p-8 rounded-xl border border-white/5">
                <div className="flex text-[#14a800] mb-4">★★★★★</div>
                <p className="text-gray-300 mb-6 italic">
                  "Mohammed knows his domain, very responsive and like the way
                  he engages his client."
                </p>
                <p className="font-bold text-white text-sm">
                  Changing primary domain
                </p>
              </div>
              <div className="bg-[#161819] p-8 rounded-xl border border-white/5">
                <div className="flex text-[#14a800] mb-4">★★★★★</div>
                <p className="text-gray-300 mb-6 italic">
                  "He completed the project within the timeframe. Very
                  responsive, troubleshoots immediately. Knows what he is
                  doing."
                </p>
                <p className="font-bold text-white text-sm">
                  Change website domain name
                </p>
              </div>
              <div className="bg-[#161819] p-8 rounded-xl border border-white/5">
                <div className="flex text-[#14a800] mb-4">★★★★★</div>
                <p className="text-gray-300 mb-6 italic">
                  "A good developer who knows exactly what to do. Really
                  efficient and a great person to work with. Highly
                  recommended."
                </p>
                <p className="font-bold text-white text-sm">
                  Web designer required
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-10 text-center border-t border-white/5">
        <div className="flex justify-center gap-6 mb-8">
          <a
            href={content?.upworkLink || "#"}
            target="_blank"
            className="text-gray-400 hover:text-[#14a800]"
          >
            Upwork
          </a>
          <a href="/dashboard" className="text-gray-400 hover:text-white">
            Admin
          </a>
        </div>
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Magfar. Top Rated WordPress
          Developer.
        </p>
      </footer>
    </main>
  );
}
