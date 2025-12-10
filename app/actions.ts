'use server'

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// --- HELPER FOR REDIRECT WITH TOAST ---
// This function cleans up the code by handling the "Success" redirect
function successRedirect(path: string, message: string) {
  revalidatePath(path);
  redirect(`${path}?success=${encodeURIComponent(message)}`);
}

// --- AUTH ---
export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin || admin.password !== password) {
    // For login page, we can just throw error or redirect with error
    redirect('/login?error=Invalid username or password');
  }

  const oneDay = 24 * 60 * 60 * 1000;
  (await cookies()).set('admin_session', 'true', { expires: Date.now() + oneDay });

  redirect('/dashboard');
}

export async function logout() {
  (await cookies()).delete('admin_session');
  redirect('/login?success=Logged out successfully');
}

// --- PROFILE ---
export async function updateText(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');

  // 1. HANDLE IMAGE UPLOAD (ImgBB)
  let imageUrl = formData.get('imageUrl') as string;
  const imageFile = formData.get('imageFile') as File;

  if (imageFile && imageFile.size > 0) {
    const imgBBFormData = new FormData();
    imgBBFormData.append('image', imageFile);
    imgBBFormData.append('key', process.env.IMGBB_API_KEY as string);

    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imgBBFormData,
      });
      const result = await response.json();
      if (result.success) {
        imageUrl = result.data.url;
      }
    } catch (error) {
      console.error("Upload failed", error);
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
    imageUrl: imageUrl,
    aboutTitle: formData.get('aboutTitle') as string,
    aboutBody: formData.get('aboutBody') as string,
    githubLink: formData.get('githubLink') as string,
  };

  const firstRecord = await prisma.content.findFirst();
  
  if (firstRecord) {
    await prisma.content.update({ where: { id: firstRecord.id }, data });
  } else {
    await prisma.content.create({ data });
  }

  // Redirect with Success Message
  successRedirect('/dashboard', 'Profile updated successfully!');
}

// --- PROJECTS ---
export async function addProject(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');

  await prisma.project.create({
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      link: formData.get('link') as string,
      techStack: formData.get('techStack') as string,
    }
  });

  successRedirect('/dashboard/projects', 'New project added!');
}

export async function deleteProject(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');

  await prisma.project.delete({ where: { id: parseInt(formData.get('id') as string) } });

  successRedirect('/dashboard/projects', 'Project deleted.');
}

// --- SKILLS ---
export async function addSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');
  
  await prisma.skill.create({ data: { name: formData.get('name') as string } });

  successRedirect('/dashboard/skills', 'Skill added!');
}

export async function deleteSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');
  
  await prisma.skill.delete({ where: { id: parseInt(formData.get('id') as string) } });

  successRedirect('/dashboard/skills', 'Skill removed.');
}

// --- TESTIMONIALS ---
export async function addTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');

  await prisma.testimonial.create({
    data: {
      client: formData.get('client') as string,
      review: formData.get('review') as string,
      rating: formData.get('rating') as string,
    }
  });

  successRedirect('/dashboard/testimonials', 'Testimonial added!');
}

export async function editTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');

  await prisma.testimonial.update({
    where: { id: parseInt(formData.get('id') as string) },
    data: {
      client: formData.get('client') as string,
      review: formData.get('review') as string,
      rating: formData.get('rating') as string,
    }
  });

  successRedirect('/dashboard/testimonials', 'Testimonial updated!');
}

export async function deleteTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) redirect('/login');
  
  await prisma.testimonial.delete({ where: { id: parseInt(formData.get('id') as string) } });

  successRedirect('/dashboard/testimonials', 'Testimonial deleted.');
}


// --- PRODUCTS ---
export async function addProduct(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

  // Handle Image Upload
  let imageUrl = formData.get('imageUrl') as string;
  const imageFile = formData.get('imageFile') as File;

  if (imageFile && imageFile.size > 0) {
    const imgBBFormData = new FormData();
    imgBBFormData.append('image', imageFile);
    imgBBFormData.append('key', process.env.IMGBB_API_KEY as string);
    try {
      const response = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: imgBBFormData });
      const result = await response.json();
      if (result.success) imageUrl = result.data.url;
    } catch (e) { console.error(e); }
  }

  // Create Slug from Title
  const title = formData.get('title') as string;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  await prisma.product.create({
    data: {
      title,
      slug,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      features: formData.get('features') as string,
      demoLink: formData.get('demoLink') as string,
      imageUrl,
      // For now, we assume simple variations or empty
      variations: formData.get('variations') as string
    }
  });

  revalidatePath('/store');
  revalidatePath('/dashboard/products');
}

export async function deleteProduct(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.product.delete({ where: { id: parseInt(formData.get('id') as string) } });
  revalidatePath('/store');
  revalidatePath('/dashboard/products');
}

// --- ORDERS ---
export async function placeOrder(orderData: any) {
  // logic to save order
  await prisma.order.create({
    data: {
      customerName: orderData.name,
      email: orderData.email,
      total: orderData.total,
      status: 'pending' 
    }
  });
  // In a real app, here you would trigger Stripe/PayPal
}