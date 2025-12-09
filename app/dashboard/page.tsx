import { prisma } from "@/lib/prisma";
import { updateText, addProject, deleteProject } from "../actions";

export default async function Dashboard() {
  const content = await prisma.content.findFirst();
  const projects = await prisma.project.findMany({ orderBy: { id: "desc" } });

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <h1 className="text-4xl font-bold mb-10 border-b pb-4">
        Portfolio Manager
      </h1>

      {/* PART 1: MAIN CONTENT FORM */}
      <form
        action={updateText}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        {/* Hero Section */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
          <h2 className="font-bold text-xl mb-4">Hero Section</h2>
          <div className="flex flex-col gap-3">
            <input
              name="newText"
              defaultValue={content?.text}
              className="p-2 border rounded"
              placeholder="Main Title"
            />
            <input
              name="subtext"
              defaultValue={content?.subtext || ""}
              className="p-2 border rounded"
              placeholder="Subtitle"
            />
            <input
              name="imageUrl"
              defaultValue={content?.imageUrl || ""}
              className="p-2 border rounded"
              placeholder="/me.jpg"
            />
          </div>
        </div>

        {/* Links Section */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
          <h2 className="font-bold text-xl mb-4">Social Links</h2>
          <div className="flex flex-col gap-3">
            <input
              name="upworkLink"
              defaultValue={content?.upworkLink || ""}
              className="p-2 border rounded"
              placeholder="Upwork Profile URL"
            />
            <input
              name="githubLink"
              defaultValue={content?.githubLink || ""}
              className="p-2 border rounded"
              placeholder="GitHub Profile URL"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
          <h2 className="font-bold text-xl mb-4">Stats</h2>
          <div className="flex gap-3">
            <input
              name="statNumber"
              defaultValue={content?.statNumber || ""}
              className="w-1/2 p-2 border rounded"
              placeholder="100%"
            />
            <input
              name="statLabel"
              defaultValue={content?.statLabel || ""}
              className="w-1/2 p-2 border rounded"
              placeholder="Success Rate"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500 md:col-span-2">
          <h2 className="font-bold text-xl mb-4">About Me</h2>
          <input
            name="aboutTitle"
            defaultValue={content?.aboutTitle || ""}
            className="w-full p-2 border rounded mb-2"
            placeholder="Title"
          />
          <textarea
            name="aboutBody"
            defaultValue={content?.aboutBody || ""}
            className="w-full p-2 border rounded h-32"
            placeholder="Description"
          />
        </div>

        <button className="md:col-span-2 bg-black text-white py-3 rounded font-bold hover:bg-gray-800">
          Save General Settings
        </button>
      </form>

      {/* PART 2: PROJECTS MANAGER */}
      <div className="border-t pt-10">
        <h2 className="text-3xl font-bold mb-6">My Projects</h2>

        {/* Add Project Form */}
        <div className="bg-gray-100 p-6 rounded mb-8">
          <h3 className="font-bold mb-4">Add New Project</h3>
          <form action={addProject} className="flex flex-col gap-3">
            <input
              name="title"
              placeholder="Project Title (e.g. E-commerce App)"
              className="p-2 border rounded"
              required
            />
            <input
              name="description"
              placeholder="Short description..."
              className="p-2 border rounded"
              required
            />
            <input
              name="techStack"
              placeholder="Tech Used (e.g. Next.js, Stripe)"
              className="p-2 border rounded"
            />
            <input
              name="link"
              placeholder="Project URL"
              className="p-2 border rounded"
            />
            <button className="bg-blue-600 text-white py-2 rounded font-bold w-40">
              Add Project
            </button>
          </form>
        </div>

        {/* List of Existing Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-4 rounded shadow flex justify-between items-start border"
            >
              <div>
                <h4 className="font-bold text-lg">{project.title}</h4>
                <p className="text-gray-600 text-sm">{project.description}</p>
                <p className="text-blue-500 text-xs mt-1">
                  {project.techStack}
                </p>
              </div>
              <form action={deleteProject}>
                <input type="hidden" name="id" value={project.id} />
                <button className="text-red-500 text-sm hover:underline">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
