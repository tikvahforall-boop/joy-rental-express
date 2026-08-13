import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireAuth,
} from "@/lib/api-utils";
import { vehicleCreateSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "12");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const transmission = searchParams.get("transmission");
    const fuelType = searchParams.get("fuelType");
    const seats = searchParams.get("seats");
    const instantBook = searchParams.get("instantBook");
    const delivery = searchParams.get("delivery");
    const sort = searchParams.get("sort") ?? "recommended";
    const make = searchParams.get("make");

    const where: Record<string, unknown> = {
      status: "ACTIVE",
    };

    if (category) where.category = category;
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (state) where.state = state;
    if (make) where.make = { contains: make, mode: "insensitive" };
    if (minPrice || maxPrice) {
      where.dailyPrice = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }
    if (transmission) where.transmission = transmission;
    if (fuelType) where.fuelType = fuelType;
    if (seats) where.seats = { gte: parseInt(seats) };
    if (instantBook === "true") where.instantBookEligible = true;
    if (delivery === "true") where.deliveryEnabled = true;

    const features = searchParams.get("features");
    if (features) {
      where.features = {
        some: {
          name: { in: features.split(",") },
        },
      };
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    switch (sort) {
      case "price_asc":
        orderBy = { dailyPrice: "asc" };
        break;
      case "price_desc":
        orderBy = { dailyPrice: "desc" };
        break;
      case "rating":
        orderBy = { avgRating: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          images: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }], take: 1 },
          features: true,
          host: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    return successResponse({
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const body = await request.json();

    const validated = vehicleCreateSchema.parse(body);
    const { features, ...vehicleData } = validated;

    const slug = slugify(
      `${vehicleData.make}-${vehicleData.model}-${vehicleData.year}-${Date.now().toString(36)}`
    );

    const vehicle = await prisma.vehicle.create({
      data: {
        ...vehicleData,
        slug,
        hostId: userId,
        status: "PENDING_APPROVAL",
        features: features
          ? {
              create: features.map((name) => ({ name })),
            }
          : undefined,
      },
      include: {
        features: true,
        images: true,
      },
    });

    return successResponse(vehicle, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
