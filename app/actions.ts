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

// 3. UPDATE TEXT ACTION
export async function updateText(formData: FormData) {
  // FIX: Await cookies() here
  const cookieStore = await cookies();

  if (!cookieStore.has("admin_session")) {
    throw new Error("Unauthorized");
  }

  const newText = formData.get("newText") as string;

  const firstRecord = await prisma.content.findFirst();
  if (firstRecord) {
    await prisma.content.update({
      where: { id: firstRecord.id },
      data: { text: newText },
    });
  } else {
    await prisma.content.create({ data: { text: newText } });
  }

  revalidatePath("/");
}
