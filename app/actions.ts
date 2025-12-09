"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateText(formData: FormData) {
  // 1. Get data safely
  const password = formData.get("password");
  const newText = formData.get("newText");

  // 2. Validate data types (TypeScript fix)
  if (typeof password !== "string" || typeof newText !== "string") {
    throw new Error("Invalid input");
  }

  // 3. Check password
  if (password !== "1234") {
    throw new Error("Wrong password!");
  }

  // 4. Find record
  const firstRecord = await prisma.content.findFirst();

  // 5. Update or Create
  if (firstRecord) {
    await prisma.content.update({
      where: { id: firstRecord.id },
      data: { text: newText },
    });
  } else {
    await prisma.content.create({
      data: { text: newText },
    });
  }

  // 6. Refresh and Redirect
  revalidatePath("/");
  redirect("/");
}
