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

// ... imports ...

// --- PRODUCTS ---

// 1. ADD PRODUCT
export async function addProduct(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

  // Image Upload Logic (Keep existing)
  let imageUrl = formData.get('imageUrl') as string;
  const imageFile = formData.get('imageFile') as File;
  if (imageFile && imageFile.size > 0) {
    const imgBBFormData = new FormData();
    imgBBFormData.append('image', imageFile);
    imgBBFormData.append('key', process.env.IMGBB_API_KEY as string);
    try {
      const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: imgBBFormData });
      const json = await res.json();
      if (json.success) imageUrl = json.data.url;
    } catch(e) {}
  }

  const title = formData.get('title') as string;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  await prisma.product.create({
    data: {
      title,
      slug,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      features: formData.get('features') as string,
      officialLink: formData.get('officialLink') as string, // Renamed
      focusKeyword: formData.get('focusKeyword') as string, // New
      variations: formData.get('variations') as string,     // New
      imageUrl,
    }
  });

  revalidatePath('/store');
  revalidatePath('/dashboard/products');
}

// 2. UPDATE PRODUCT (NEW)
export async function updateProduct(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

  const id = parseInt(formData.get('id') as string);
  
  // Handle Image Upload (only update if new file exists)
  let imageUrl = formData.get('imageUrl') as string; // existing URL
  const imageFile = formData.get('imageFile') as File;
  if (imageFile && imageFile.size > 0) {
     // ... insert same ImgBB upload logic as above ...
     const imgBBFormData = new FormData();
     imgBBFormData.append('image', imageFile);
     imgBBFormData.append('key', process.env.IMGBB_API_KEY as string);
     try {
       const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: imgBBFormData });
       const json = await res.json();
       if (json.success) imageUrl = json.data.url;
     } catch(e) {}
  }

  await prisma.product.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      features: formData.get('features') as string,
      officialLink: formData.get('officialLink') as string,
      focusKeyword: formData.get('focusKeyword') as string,
      variations: formData.get('variations') as string,
      imageUrl,
    }
  });

  revalidatePath('/store');
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products'); // Go back to list
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

// --- CUSTOMER AUTH ---
export async function customerSignup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Simple validation
  if (!email || !password) throw new Error('Missing fields');

  // Check if exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');

  // Create User
  await prisma.user.create({
    data: { name, email, password }
  });

  // In a real app, you would set a session cookie here
  // For now, we just return success
}

export async function customerLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== password) {
    throw new Error('Invalid credentials');
  }

  // Login successful
}

// --- COUPONS ---
export async function addCoupon(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

  await prisma.coupon.create({
    data: {
      code: formData.get('code') as string,
      discount: parseInt(formData.get('discount') as string),
    }
  });
  revalidatePath('/dashboard/coupons');
}

export async function deleteCoupon(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  
  await prisma.coupon.delete({ where: { id: parseInt(formData.get('id') as string) } });
  revalidatePath('/dashboard/coupons');
}

// Check if coupon is valid (Call this from Client Component)
export async function verifyCoupon(code: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive) return null;
  return coupon.discount;
}

// --- ORDERS ---
export async function updateOrderStatus(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

  const id = parseInt(formData.get('id') as string);
  const status = formData.get('status') as string;

  await prisma.order.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/dashboard/orders');
}

export async function placeOrder(orderData: any) {
  // Updated to include items and coupon
  await prisma.order.create({
    data: {
      customerName: orderData.name,
      email: orderData.email,
      total: orderData.total,
      items: JSON.stringify(orderData.items), // Save cart items
      couponCode: orderData.couponCode || null,
      status: orderData.total === 0 ? 'Complete' : 'Processing' // Auto-complete free orders
    }
  });
}