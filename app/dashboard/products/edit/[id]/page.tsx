{/* PRODUCT LIST */}
<div className="grid grid-cols-1 gap-4">
  {products.map((p) => (
    <div key={p.id} className="bg-white p-4 rounded border flex justify-between items-center text-black">
      <div className="flex items-center gap-4">
        {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-12 h-12 object-cover rounded" />}
        <div>
          <h3 className="font-bold">{p.title}</h3>
          <p className="text-sm text-gray-500">${Number(p.price).toFixed(2)}</p>
        </div>
      </div>
      <div className="flex gap-3">
        {/* EDIT BUTTON */}
        <a href={`/dashboard/products/edit/${p.id}`} className="px-3 py-1 bg-gray-100 text-blue-600 rounded text-sm font-bold hover:bg-gray-200">
          Edit
        </a>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={p.id} />
          <button className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100">Delete</button>
        </form>
      </div>
    </div>
  ))}
</div>