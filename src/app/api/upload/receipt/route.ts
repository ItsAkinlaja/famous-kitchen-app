import { NextRequest, NextResponse } from "next/server";
import { uploadReceipt } from "@/lib/imagekit";
import { rateLimit } from "@/lib/rateLimit";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  // Rate limit: max 10 uploads per IP per 10 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`receipt:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json(
      { success: false, error: "Too many uploads. Please wait a moment and try again." },
      { status: 429 }
    );
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "No file provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, and WebP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File must be under 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const url = await uploadReceipt(buffer, file.name, file.type);

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("[upload/receipt]", err);
    return NextResponse.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
