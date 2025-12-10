import { prisma } from '@/lib/prisma';
import { updateText } from '../actions';

export default async function DashboardProfile() {
  const content = await prisma.content.findFirst();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24 font-sans text-gray-800">
      
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your homepage content and personal details.</p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold border border-green-200">
          Admin Mode
        </div>
      </div>

      <form action={updateText} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: VISUALS --- */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* PHOTO UPLOAD CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Profile Photo</h2>
            
            {/* Image Preview */}
            <div className="aspect-square w-full rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden relative group">
              <img 
                src={content?.imageUrl || '/me.png'} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hidden input to keep old URL if no new file is uploaded */}
            <input type="hidden" name="imageUrl" value={content?.imageUrl || ''} />

            {/* File Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Upload New Photo</label>
              <input 
                type="file" 
                name="imageFile" 
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-[11px] text-gray-400 leading-tight">
                Select a file to auto-upload to ImgBB. If empty, the current photo stays.
              </p>
            </div>
          </div>

          {/* QUICK LINKS CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h2 className="font-bold text-lg mb-4 text-gray-800">External Links</h2>
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">Upwork Profile URL</label>
                  <input name="upworkLink" defaultValue={content?.upworkLink || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
               </div>
               <div>
                  <label className="text-xs font-bold uppercase text-gray-500">GitHub Profile URL</label>
                  <input name="githubLink" defaultValue={content?.githubLink || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
               </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: CONTENT --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* HERO INFO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Hero Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Main Headline</label>
                <input name="newText" defaultValue={content?.text} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" />
              </div>
              
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Subtitle / Bio</label>
                <textarea name="subtext" defaultValue={content?.subtext || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Location</label>
                <input name="location" defaultValue={content?.location || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Hourly Rate</label>
                <input name="hourlyRate" defaultValue={content?.hourlyRate || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Stat Value (e.g. 100%)</label>
                <input name="statNumber" defaultValue={content?.statNumber || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

               <div>
                <label className="text-xs font-bold uppercase text-gray-500">Stat Label</label>
                <input name="statLabel" defaultValue={content?.statLabel || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* ABOUT INFO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">About Section</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Section Title</label>
                <input name="aboutTitle" defaultValue={content?.aboutTitle || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Full Description</label>
                <textarea name="aboutBody" defaultValue={content?.aboutBody || ''} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-40" />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="sticky bottom-6">
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-800 hover:scale-[1.01] transition-all">
              Save & Upload
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}