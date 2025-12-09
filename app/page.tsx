import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await prisma.content.findFirst();
  const projects = await prisma.project.findMany({ orderBy: { id: "desc" } });

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500 selection:text-white">
      {/* 1. HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter">magfar.</div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#work" className="hover:text-white transition">
              Work
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>
            <a
              href={content?.upworkLink || "#"}
              target="_blank"
              className="text-green-400 hover:text-green-300"
            >
              Hire Me on Upwork
            </a>
          </nav>
        </div>
      </header>

      {/* 2. HERO */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-3 py-1 mb-4 border border-purple-500/30 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold tracking-wider uppercase">
            Available for work
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            {content?.text || "Loading..."}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto md:mx-0">
            {content?.subtext}
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a
              href={content?.upworkLink || "#"}
              target="_blank"
              className="px-8 py-3 bg-[#14a800] text-white font-bold rounded-full hover:bg-[#108a00] transition shadow-lg shadow-green-900/20"
            >
              Upwork Profile
            </a>
            <a
              href={content?.githubLink || "#"}
              target="_blank"
              className="px-8 py-3 border border-white/20 rounded-full hover:bg-white/10 transition"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gray-800">
            <img
              src={content?.imageUrl || "/me.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. STATS STRIP */}
      <div className="border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-white">
              {content?.statNumber}
            </div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">
              {content?.statLabel}
            </div>
          </div>
          <div className="h-px w-full md:w-px md:h-12 bg-white/10"></div>
          <div className="text-gray-400 text-lg italic">
            "Top Rated Freelancer delivering high-quality web solutions."
          </div>
        </div>
      </div>

      {/* 4. PORTFOLIO GRID */}
      <section id="work" className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
          <span className="w-8 h-px bg-purple-500"></span>
          Selected Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">
            No projects added yet. Go to Admin Dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <a
                href={project.link || "#"}
                target="_blank"
                key={project.id}
                className="group block bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition duration-300"
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.split(",").map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/5"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* 5. ABOUT */}
      <section id="about" className="py-24 bg-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-purple-400">
            {content?.aboutTitle}
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">
            {content?.aboutBody}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/10">
        <p>
          <Link href="/dashboard" className="hover:text-gray-400">
            Admin Login
          </Link>
          <span className="mx-2">•</span>
          &copy; {new Date().getFullYear()} magfar.
        </p>
      </footer>
    </main>
  );
}
