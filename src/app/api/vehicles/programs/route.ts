import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const program = searchParams.get("program");

    const where: Record<string, unknown> = { status: "ACTIVE" };

    if (program === "long-term") {
      where.longTermAvailable = true;
    } else if (program === "rent-to-own") {
      where.rentToOwnAvailable = true;
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        images: {
          orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
          take: 1,
          select: { url: true },
        },
        features: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = vehicles.map((v) => ({
      id: v.id,
      slug: v.slug,
      make: v.make,
      model: v.model,
      year: v.year,
      trim: v.trim,
      category: v.category,
      seats: v.seats,
      transmission: v.transmission,
      fuelType: v.fuelType,
      city: v.city,
      state: v.state,
      dailyPrice: v.dailyPrice,
      weeklyPrice: v.weeklyPrice,
      monthlyPrice: v.monthlyPrice,
      purchasePrice: v.purchasePrice,
      rtoDownPayment: v.rtoDownPayment,
      rtoMonthlyPayment: v.rtoMonthlyPayment,
      rtoTermMonths: v.rtoTermMonths,
      longTermAvailable: v.longTermAvailable,
      rentToOwnAvailable: v.rentToOwnAvailable,
      imageUrl: v.images[0]?.url || null,
      features: v.features.map((f) => f.name),
    }));

    return successResponse({ vehicles: formatted });
  } catch (error) {
    return handleApiError(error);
  }
}
