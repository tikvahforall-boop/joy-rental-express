import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireAuth,
} from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        images: { orderBy: { position: "asc" } },
        features: true,
        host: {
          select: {
            id: true,
            name: true,
            firstName: true,
            avatarUrl: true,
            createdAt: true,
            hostProfile: {
              select: {
                bio: true,
                responseRate: true,
                responseTime: true,
                superHost: true,
                totalTrips: true,
                avgRating: true,
              },
            },
          },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            author: {
              select: { id: true, name: true, firstName: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        addOns: { where: { isActive: true } },
        pricingRules: { where: { isActive: true } },
        deliveryZones: true,
      },
    });

    if (!vehicle) {
      return errorResponse("Vehicle not found", 404);
    }

    return successResponse(vehicle);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const { id } = await params;
    const body = await request.json();

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return errorResponse("Vehicle not found", 404);

    const userRole = (session.user as { role?: string }).role;
    if (vehicle.hostId !== userId && userRole !== "ADMIN") {
      return errorResponse("Forbidden", 403);
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: body,
      include: { images: true, features: true },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return errorResponse("Vehicle not found", 404);

    const userRole = (session.user as { role?: string }).role;
    if (vehicle.hostId !== userId && userRole !== "ADMIN") {
      return errorResponse("Forbidden", 403);
    }

    await prisma.vehicle.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    return successResponse({ message: "Vehicle deactivated" });
  } catch (error) {
    return handleApiError(error);
  }
}
