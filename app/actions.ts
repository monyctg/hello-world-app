"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// 1. LOGIN ACTION
export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const admin = await prisma.admin.findUnique({
    where: { username: username },
  });

  if (!admin || admin.password !== password) {
    throw new Error("Invalid username or password");
  }

  const oneDay = 24 * 60 * 60 * 1000;

  // FIX: Await cookies() here
  (await cookies()).set("admin_session", "true", {
    expires: Date.now() + oneDay,
  });

  redirect("/dashboard");
}

// 2. LOGOUT ACTION
export async function logout() {
  // FIX: Await cookies() here
  (await cookies()).delete("admin_session");
  redirect("/login");
}

// 3. UPDATE TEXT ACTION (Updated)

export async function updateText(formData: FormData) {
  const cookieStore = await cookies();

  if (!cookieStore.has("admin_session")) {
    throw new Error("Unauthorized");
  }

  // Get data
  const newText = formData.get("newText") as string;
  const subtext = formData.get("subtext") as string;
  const statNumber = formData.get("statNumber") as string;
  const statLabel = formData.get("statLabel") as string;
  const aboutTitle = formData.get("aboutTitle") as string;
  const aboutBody = formData.get("aboutBody") as string;
  const upworkLink = formData.get("upworkLink") as string;
  const githubLink = formData.get("githubLink") as string;
  const imageUrl = formData.get("imageUrl") as string; // <-- GET IMAGE

  const firstRecord = await prisma.content.findFirst();

  if (firstRecord) {
    await prisma.content.update({
      where: { id: firstRecord.id },
      data: {
        text: newText,
        subtext,
        statNumber,
        statLabel,
        aboutTitle,
        aboutBody,
        imageUrl, // <-- SAVE IMAGE
        upworkLink,
        githubLink,
      },
    });
  } else {
    await prisma.content.create({
      data: {
        text: newText,
        subtext,
        statNumber,
        statLabel,
        aboutTitle,
        aboutBody,
        imageUrl,
      },
    });
  }

  revalidatePath("/");
}

// 4. ADD PROJECT ACTION
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
  revalidatePath("/dashboard");
}

// 5. DELETE PROJECT ACTION
export async function deleteProject(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  const projectId = parseInt(formData.get("id") as string);

  await prisma.project.delete({
    where: { id: projectId },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}
// 6. SKILLS ACTIONS
export async function addSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.skill.create({
    data: { name: formData.get("name") as string },
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function deleteSkill(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.skill.delete({
    where: { id: parseInt(formData.get("id") as string) },
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
}

// 7. TESTIMONIAL ACTIONS
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
  revalidatePath("/dashboard");
}

export async function deleteTestimonial(formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_session")) throw new Error("Unauthorized");

  await prisma.testimonial.delete({
    where: { id: parseInt(formData.get("id") as string) },
  });
  revalidatePath("/");
  revalidatePath("/dashboard");
}
