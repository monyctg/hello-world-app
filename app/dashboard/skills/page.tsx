import { prisma } from "@/lib/prisma";
import { addSkill, deleteSkill } from "../../actions";

export default async function DashboardSkills() {
  const skills = await prisma.skill.findMany();

  return (
    <div className="max-w-5xl mx-auto p-10 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Skills & Expertise
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        {/* SKILLS LIST */}
        <div className="flex flex-wrap gap-3 mb-8">
          {skills.map((skill) => (
            <form
              key={skill.id}
              action={deleteSkill}
              className="bg-gray-100 pl-4 pr-2 py-2 rounded-full flex items-center gap-3 border hover:border-red-300 group transition"
            >
              <span className="font-medium text-gray-700">{skill.name}</span>
              <input type="hidden" name="id" value={skill.id} />
              <button className="w-6 h-6 rounded-full bg-white text-gray-400 group-hover:text-red-500 flex items-center justify-center font-bold pb-1">
                ×
              </button>
            </form>
          ))}
        </div>

        {/* ADD SKILL */}
        <form action={addSkill} className="flex gap-4 max-w-md">
          <input
            name="name"
            placeholder="Add Skill (e.g. Docker)"
            className="flex-1 p-3 border rounded"
            required
          />
          <button className="bg-green-600 text-white px-6 rounded font-bold hover:bg-green-700">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
