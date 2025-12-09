import { prisma } from "@/lib/prisma";
import {
  updateText,
  addProject,
  deleteProject,
  addSkill,
  deleteSkill,
  addTestimonial,
  deleteTestimonial,
} from "../actions";

export default async function Dashboard() {
  const content = await prisma.content.findFirst();
  const skills = await prisma.skill.findMany();
  const testimonials = await prisma.testimonial.findMany();

  return (
    <div className="max-w-4xl mx-auto pb-20 p-6">
      <h1 className="text-3xl font-bold mb-8">Upwork Portfolio Manager</h1>

      {/* 1. PROFILE DETAILS */}
      <section className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-bold text-xl mb-4 text-blue-600">
          Profile Details
        </h2>
        <form
          action={updateText}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="newText"
            defaultValue={content?.text}
            placeholder="Title (Expert WordPress Developer)"
            className="p-2 border rounded"
          />
          <input
            name="location"
            defaultValue={content?.location || ""}
            placeholder="Location"
            className="p-2 border rounded"
          />
          <input
            name="hourlyRate"
            defaultValue={content?.hourlyRate || ""}
            placeholder="Hourly Rate"
            className="p-2 border rounded"
          />
          <input
            name="statNumber"
            defaultValue={content?.statNumber || ""}
            placeholder="JSS (100%)"
            className="p-2 border rounded"
          />
          <input
            name="upworkLink"
            defaultValue={content?.upworkLink || ""}
            placeholder="Upwork URL"
            className="p-2 border rounded md:col-span-2"
          />
          <textarea
            name="subtext"
            defaultValue={content?.subtext || ""}
            placeholder="Bio"
            className="p-2 border rounded md:col-span-2 h-24"
          />
          <button className="bg-black text-white py-2 rounded md:col-span-2">
            Save Profile
          </button>
        </form>
      </section>

      {/* 2. SKILLS */}
      <section className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-bold text-xl mb-4 text-green-600">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <form
              key={skill.id}
              action={deleteSkill}
              className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
            >
              <span>{skill.name}</span>
              <input type="hidden" name="id" value={skill.id} />
              <button className="text-red-500 font-bold">×</button>
            </form>
          ))}
        </div>
        <form action={addSkill} className="flex gap-2">
          <input
            name="name"
            placeholder="Add Skill (e.g. WordPress)"
            className="p-2 border rounded w-full"
            required
          />
          <button className="bg-green-600 text-white px-4 rounded">Add</button>
        </form>
      </section>

      {/* 3. TESTIMONIALS */}
      <section className="bg-white p-6 rounded shadow mb-8">
        <h2 className="font-bold text-xl mb-4 text-yellow-600">Testimonials</h2>
        <div className="grid gap-4 mb-4">
          {testimonials.map((t) => (
            <div key={t.id} className="border p-3 rounded flex justify-between">
              <div>
                <p className="font-bold">{t.client}</p>
                <p className="text-sm text-gray-600">"{t.review}"</p>
                <p className="text-yellow-600 text-sm">★ {t.rating}</p>
              </div>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <button className="text-red-500">Delete</button>
              </form>
            </div>
          ))}
        </div>
        <form action={addTestimonial} className="flex flex-col gap-2">
          <input
            name="client"
            placeholder="Project Name / Client"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="review"
            placeholder="Review text..."
            className="p-2 border rounded"
            required
          />
          <input
            name="rating"
            placeholder="Rating (5.0)"
            className="p-2 border rounded"
          />
          <button className="bg-yellow-600 text-white py-2 rounded">
            Add Review
          </button>
        </form>
      </section>
    </div>
  );
}
