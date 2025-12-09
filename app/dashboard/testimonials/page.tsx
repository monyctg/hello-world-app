import { prisma } from "@/lib/prisma";
import {
  addTestimonial,
  editTestimonial,
  deleteTestimonial,
} from "../../actions";

export default async function DashboardTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto p-10 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Client Reviews</h1>

      {/* ADD NEW */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
        <h2 className="font-bold text-lg mb-4 text-yellow-600">
          Add New Review
        </h2>
        <form
          action={addTestimonial}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            name="client"
            placeholder="Client Name"
            className="p-3 border rounded"
            required
          />
          <input
            name="rating"
            placeholder="5.0"
            className="p-3 border rounded w-full"
          />
          <textarea
            name="review"
            placeholder="Review text..."
            className="p-3 border rounded md:col-span-2 h-12 py-2"
            required
          />
          <button className="md:col-span-4 bg-yellow-500 text-white py-2 rounded font-bold hover:bg-yellow-600">
            Add Testimonial
          </button>
        </form>
      </div>

      {/* EDIT LIST */}
      <div className="grid gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border p-4 rounded-lg shadow-sm">
            <form
              action={editTestimonial}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
            >
              <input type="hidden" name="id" value={t.id} />

              <div className="md:col-span-3">
                <label className="text-xs font-bold text-gray-400">
                  Client
                </label>
                <input
                  name="client"
                  defaultValue={t.client}
                  className="w-full p-2 border rounded text-sm font-bold"
                />
              </div>

              <div className="md:col-span-7">
                <label className="text-xs font-bold text-gray-400">
                  Review
                </label>
                <textarea
                  name="review"
                  defaultValue={t.review}
                  className="w-full p-2 border rounded text-sm h-20"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <div>
                  <label className="text-xs font-bold text-gray-400">
                    Rating
                  </label>
                  <input
                    name="rating"
                    defaultValue={t.rating}
                    className="w-full p-2 border rounded text-sm text-center"
                  />
                </div>
                <div className="flex gap-1 mt-1">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 flex-1"
                  >
                    Save
                  </button>
                  <button
                    formAction={deleteTestimonial}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Del
                  </button>
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
