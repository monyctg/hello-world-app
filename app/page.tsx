import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await prisma.content.findFirst();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 bg-black">
      {/* 
         New Classes Explained:
         - bg-gradient-to-r: Create a gradient from left to right
         - from-purple-400 via-pink-500 to-red-500: The colors
         - bg-clip-text: Cut the background to the shape of text
         - text-transparent: Hide the black ink so the gradient shows through
         - animate-gradient-text: The custom CSS rule we added in globals.css
      */}
      <h1
        className="
        text-5xl md:text-7xl lg:text-9xl 
        font-extrabold text-center 
        break-words max-w-5xl leading-tight
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        bg-clip-text text-transparent 
        animate-gradient-text
      "
      >
        {content?.text || "Loading..."}
      </h1>

      <Link href="/dashboard" className="...">
        Go to Admin Dashboard
      </Link>
    </main>
  );
}
