import { prisma } from "@/lib/prisma";
import { addProject, deleteProject } from "../../actions";

export default async function DashboardProjects() {
  const projects = await prisma.project.findMany({ orderBy: { id: "desc" } });

  return (
    <div className="max-w-5xl mx-auto p-10 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Portfolio Projects
      </h1>

      {/* ADD NEW */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h2 className="font-bold text-lg mb-4 text-purple-600">
          Add New Project
        </h2>
        <form
          action={addProject}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="title"
            placeholder="Project Title"
            className="p-3 border rounded"
            required
          />
          <input
            name="link"
            placeholder="Live URL (https://...)"
            className="p-3 border rounded"
          />
          <input
            name="techStack"
            placeholder="Tech (e.g. Next.js, WordPress)"
            className="p-3 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description..."
            className="p-3 border rounded h-12 py-2"
            required
          />
          <button className="md:col-span-2 bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700">
            Add Project
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-lg border shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">
                  {p.techStack}
                </span>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    className="text-xs text-blue-500 underline self-center"
                  >
                    View Live
                  </a>
                )}
              </div>
            </div>
            <form action={deleteProject} className="mt-4 border-t pt-4">
              <input type="hidden" name="id" value={p.id} />
              <button className="text-red-500 text-sm hover:underline w-full text-right">
                Delete Project
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
