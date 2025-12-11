'use server'

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// --- 1. ADMIN AUTH ---
export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin || admin.password !== password) {
    throw new Error('Invalid username or password');
  }

  const oneDay = 24 * 60 * 60 * 1000;
  (await cookies()).set('admin_session', 'true', { expires: Date.now() + oneDay });

  redirect('/dashboard');
}

export async function logout() {
  (await cookies()).delete('admin_session');
  redirect('/login');
}

// --- 2. CUSTOMER AUTH ---
export async function customerSignup(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) throw new Error('Missing fields');
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');

  await prisma.user.create({ data: { name, email, password } });
}

export async function customerLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) throw new Error('Invalid credentials');
}

// --- 3. PROFILE CONTENT ---
export async function updateText(formData: FormData) {
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
      const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: imgBBFormData });
      const json = await res.json();
      if (json.success) imageUrl = json.data.url;
    } catch(e) {}
  }

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

  revalidatePath('/');
  revalidatePath('/dashboard');
}

// --- 4. PRODUCTS ---
export async function addProduct(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

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
      officialLink: formData.get('officialLink') as string,
      focusKeyword: formData.get('focusKeyword') as string,
      variations: formData.get('variations') as string,
      imageUrl,
    }
  });

  revalidatePath('/store');
  revalidatePath('/dashboard/products');
}

export async function updateProduct(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');

  const id = parseInt(formData.get('id') as string);
  
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
  redirect('/dashboard/products');
}

export async function deleteProduct(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.product.delete({ where: { id: parseInt(formData.get('id') as string) } });
  revalidatePath('/store');
  revalidatePath('/dashboard/products');
}

// --- 5. PROJECTS, SKILLS, TESTIMONIALS ---
export async function addProject(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.project.create({
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      link: formData.get('link') as string,
      techStack: formData.get('techStack') as string,
    }
  });
  revalidatePath('/dashboard/projects');
}
export async function deleteProject(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.project.delete({ where: { id: parseInt(formData.get('id') as string) } });
  revalidatePath('/dashboard/projects');
}
export async function addSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.skill.create({ data: { name: formData.get('name') as string } });
  revalidatePath('/dashboard/skills');
}
export async function deleteSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.skill.delete({ where: { id: parseInt(formData.get('id') as string) } });
  revalidatePath('/dashboard/skills');
}
export async function addTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.testimonial.create({
    data: {
      client: formData.get('client') as string,
      review: formData.get('review') as string,
      rating: formData.get('rating') as string,
    }
  });
  revalidatePath('/dashboard/testimonials');
}
export async function editTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.testimonial.update({
    where: { id: parseInt(formData.get('id') as string) },
    data: {
      client: formData.get('client') as string,
      review: formData.get('review') as string,
      rating: formData.get('rating') as string,
    }
  });
  revalidatePath('/dashboard/testimonials');
}
export async function deleteTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.testimonial.delete({ where: { id: parseInt(formData.get('id') as string) } });
  revalidatePath('/dashboard/testimonials');
}

// --- 6. COUPONS ---
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

export async function verifyCoupon(code: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive) return null;
  return coupon.discount;
}

// --- 7. ORDERS ---
export async function placeOrder(orderData: any) {
  await prisma.order.create({
    data: {
      customerName: orderData.name,
      email: orderData.email,
      total: orderData.total,
      items: JSON.stringify(orderData.items),
      couponCode: orderData.couponCode || null,
      status: orderData.total === 0 ? 'Complete' : 'Processing'
    }
  });
  // No revalidate needed as we redirect to Thank You page
}

export async function updateOrderStatus(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has('admin_session')) throw new Error('Unauthorized');
  await prisma.order.update({
    where: { id: parseInt(formData.get('id') as string) },
    data: { status: formData.get('status') as string }
  });
  revalidatePath('/dashboard/orders');
}