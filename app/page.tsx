import { prisma } from "@/lib/prisma";
import Link from "next/link"; // <--- Import the Link component

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await prisma.content.findFirst();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack items vertically
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "20px", // Space between text and link
      }}
    >
      {/* The Main Text */}
      <h1>{content?.text || "Loading..."}</h1>

      {/* The Admin Link */}
      <Link
        href="/admin"
        style={{ fontSize: "14px", color: "#666", textDecoration: "underline" }}
      >
        Go to Admin Panel
      </Link>
    </div>
  );
}
