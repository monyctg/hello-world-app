"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- AUTH ---
export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin || admin.password !== password) {
    throw new Error("Invalid username or password");
  }

  const oneDay = 24 * 60 * 60 * 1000;
  (await cookies()).set("admin_session", "true", {
    expires: Date.now() + oneDay,
  });

  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete("admin_session");
  redirect("/login");
}

// --- PROFILE ---
export async function updateText(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

  // 1. HANDLE IMAGE UPLOAD (ImgBB)
  let imageUrl = formData.get('imageUrl') as string; // Keep old URL by default
  const imageFile = formData.get('imageFile') as File; // Check for new file

  if (imageFile && imageFile.size > 0) {
    console.log("Uploading to ImgBB...");
    
    // Create form data for ImgBB
    const imgBBFormData = new FormData();
    imgBBFormData.append('image', imageFile);
    imgBBFormData.append('key', process.env.IMGBB_API_KEY as string);

    // Send to ImgBB API
    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imgBBFormData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        imageUrl = result.data.url; // Update variable with new ImgBB URL
      } else {
        console.error("ImgBB Error:", result);
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error('Failed to connect to image server');
    }
  }

  // 2. PREPARE DATA
  const data = {
    text: formData.get('newText') as string,
    subtext: formData.get('subtext') as string,
    location: formData.get('location') as string,
    hourlyRate: formData.get('hourlyRate') as string,
    statNumber: formData.get('statNumber') as string,
    statLabel: formData.get('statLabel') as string,
    upworkLink: formData.get('upworkLink') as string,
    imageUrl: imageUrl, // Save the new (or old) URL
    aboutTitle: formData.get('aboutTitle') as string,
    aboutBody: formData.get('aboutBody') as string,
    githubLink: formData.get('githubLink') as string, // Added Github link support
  };

  // 3. UPDATE DATABASE
  const firstRecord = await prisma.content.findFirst();
  
  if (firstRecord) {
    await prisma.content.update({ where: { id: firstRecord.id }, data });
  } else {
    await prisma.content.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/dashboard');
}

// --- PROJECTS ---
export async function addProject(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.project.create({
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      link: formData.get("link") as string,
      techStack: formData.get("techStack") as string,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}

export async function deleteProject(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.project.delete({
    where: { id: parseInt(formData.get("id") as string) },
  });
  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}

// --- SKILLS ---
export async function addSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.skill.create({ data: { name: formData.get("name") as string } });
  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}

export async function deleteSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.skill.delete({
    where: { id: parseInt(formData.get("id") as string) },
  });
  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}

// --- TESTIMONIALS ---
export async function addTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.testimonial.create({
    data: {
      client: formData.get("client") as string,
      review: formData.get("review") as string,
      rating: formData.get("rating") as string,
    },
  });
  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
}

export async function editTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.testimonial.update({
    where: { id: parseInt(formData.get("id") as string) },
    data: {
      client: formData.get("client") as string,
      review: formData.get("review") as string,
      rating: formData.get("rating") as string,
    },
  });
  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.testimonial.delete({
    where: { id: parseInt(formData.get("id") as string) },
  });
  revalidatePath("/");
  revalidatePath("/dashboard/testimonials");
}
