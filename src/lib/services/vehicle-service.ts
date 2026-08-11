import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma, Transmission, FuelType } from "@prisma/client";
import type { VehicleResult, SearchFilters, SearchResult } from "./vehicle-types";

export type { VehicleResult, SearchFilters, SearchResult };

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export async function searchVehicles(filters: SearchFilters): Promise<SearchResult> {
  const where: Prisma.VehicleWhereInput = { status: "ACTIVE" };

  const categories = toArray(filters.category);
  if (categories.length > 0) {
    where.category = { in: categories.map((c) => c.toUpperCase()) };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.dailyPrice = {};
    if (filters.minPrice !== undefined) where.dailyPrice.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.dailyPrice.lte = filters.maxPrice;
  }

  const makes = toArray(filters.make);
  if (makes.length > 0) {
    where.make = { in: makes, mode: "insensitive" };
  }

  const transmissions = toArray(filters.transmission);
  if (transmissions.length > 0) {
    where.transmission = { in: transmissions as Transmission[] };
  }

  const fuelTypes = toArray(filters.fuelType);
  if (fuelTypes.length > 0) {
    where.fuelType = { in: fuelTypes as FuelType[] };
  }

  if (filters.minSeats !== undefined) {
    where.seats = { gte: filters.minSeats };
  }

  if (filters.instantBook) {
    where.bookingMode = "INSTANT";
  }

  if (filters.deliveryAvailable) {
    where.deliveryEnabled = true;
  }

  if (filters.minRating !== undefined) {
    where.avgRating = { gte: filters.minRating };
  }

  if (filters.location) {
    const loc = filters.location;
    where.OR = [
      { city: { contains: loc, mode: "insensitive" } },
      { state: { contains: loc, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.VehicleOrderByWithRelationInput;
  switch (filters.sort) {
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
    default:
      orderBy = { totalTrips: "desc" };
  }

  const page = filters.page || 1;
  const perPage = filters.perPage || 12;

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        features: { select: { name: true } },
        host: {
          select: { name: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.vehicle.count({ where }),
  ]);

  const results: VehicleResult[] = vehicles.map((v: typeof vehicles[number]) => ({
    id: v.id,
    slug: v.slug,
    make: v.make,
    model: v.model,
    year: v.year,
    category: v.category.toLowerCase(),
    dailyPrice: v.dailyPrice,
    rating: v.avgRating ?? 0,
    reviewCount: v.totalReviews,
    seats: v.seats,
    transmission: v.transmission as VehicleResult["transmission"],
    fuelType: v.fuelType as VehicleResult["fuelType"],
    features: v.features.map((f: { name: string }) => f.name),
    city: v.city ?? "",
    state: v.state ?? "",
    instantBook: v.bookingMode === "INSTANT",
    deliveryAvailable: v.deliveryEnabled,
    hostName: v.host.firstName
      ? `${v.host.firstName} ${(v.host.lastName ?? "").charAt(0)}.`
      : v.host.name ?? "Host",
    hostAvatar: v.host.avatarUrl,
    imageUrl: v.images[0]?.url ?? null,
  }));

  return {
    vehicles: results,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function getFeaturedVehicles(): Promise<VehicleResult[]> {
  const result = await searchVehicles({ sort: "rating", perPage: 8 });
  return result.vehicles;
}

export async function getAvailableMakes(): Promise<string[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "ACTIVE" },
    select: { make: true },
    distinct: ["make"],
    orderBy: { make: "asc" },
  });
  return vehicles.map((v: { make: string }) => v.make);
}
