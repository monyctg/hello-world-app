"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateText(formData: FormData) {
  // 1. Get the data from the form
  const password = formData.get("password") as string;
  const newText = formData.get("newText") as string;

  // 2. Check the secret password (Change '1234' to whatever you want)
  if (password !== "1234") {
    throw new Error("Wrong password!");
  }

  // 3. Find the first record in the database
  const firstRecord = await prisma.content.findFirst();

  if (firstRecord) {
    // 4. Update it
    await prisma.content.update({
      where: { id: firstRecord.id },
      data: { text: newText },
    });
  } else {
    // (Optional) Create if it doesn't exist
    await prisma.content.create({
      data: { text: newText },
    });
  }

  // 5. Refresh the home page so the new text shows up immediately
  revalidatePath("/");

  // 6. Redirect back to home
  redirect("/");
}
