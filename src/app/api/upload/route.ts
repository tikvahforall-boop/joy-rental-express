import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { requireRole } from "@/lib/api-utils";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const vehicleId = formData.get("vehicleId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!vehicleId) {
    return NextResponse.json(
      { error: "vehicleId is required" },
      { status: 400 }
    );
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File too large. Max 10MB." },
      { status: 400 }
    );
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and AVIF images are allowed" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `vehicles/${vehicleId}/${Date.now()}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
  });

  const existingCount = await prisma.vehicleImage.count({
    where: { vehicleId },
  });

  const image = await prisma.vehicleImage.create({
    data: {
      vehicleId,
      url: blob.url,
      position: existingCount,
      isPrimary: existingCount === 0,
    },
  });

  return NextResponse.json(image);
}

export async function DELETE(req: NextRequest) {
  const session = await requireRole("ADMIN");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("id");

  if (!imageId) {
    return NextResponse.json(
      { error: "Image ID is required" },
      { status: 400 }
    );
  }

  const image = await prisma.vehicleImage.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  try {
    await del(image.url);
  } catch {
    // blob may already be deleted
  }

  await prisma.vehicleImage.delete({ where: { id: imageId } });

  if (image.isPrimary) {
    const next = await prisma.vehicleImage.findFirst({
      where: { vehicleId: image.vehicleId },
      orderBy: { position: "asc" },
    });
    if (next) {
      await prisma.vehicleImage.update({
        where: { id: next.id },
        data: { isPrimary: true },
      });
    }
  }

  return NextResponse.json({ success: true });
}
