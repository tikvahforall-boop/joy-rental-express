import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireRole,
} from "@/lib/api-utils";
import { vehicleCreateSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    await requireRole("ADMIN");
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        select: {
          id: true,
          make: true,
          model: true,
          year: true,
          status: true,
          dailyPrice: true,
          totalTrips: true,
          avgRating: true,
          category: true,
          slug: true,
          host: {
            select: {
              id: true,
              name: true,
              firstName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    const formatted = vehicles.map((v: typeof vehicles[number]) => ({
      ...v,
      host: {
        id: v.host.id,
        name: v.host.name || v.host.firstName || "Unknown",
      },
    }));

    return successResponse({
      vehicles: formatted,
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole("ADMIN");
    const adminId = (session.user as { id: string }).id;
    const body = await request.json();

    const { id, action } = body;

    if (!id) return errorResponse("Vehicle ID is required", 400);

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return errorResponse("Vehicle not found", 404);

    if (action === "approve") {
      const updated = await prisma.vehicle.update({
        where: { id },
        data: {
          status: "ACTIVE",
          approvedBy: adminId,
          approvedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "APPROVE_VEHICLE",
          entity: "Vehicle",
          entityId: id,
          details: { make: vehicle.make, model: vehicle.model },
        },
      });

      return successResponse(updated);
    }

    if (action === "suspend") {
      const updated = await prisma.vehicle.update({
        where: { id },
        data: {
          status: "SUSPENDED",
          suspendedReason: body.reason || null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "SUSPEND_VEHICLE",
          entity: "Vehicle",
          entityId: id,
          details: {
            reason: body.reason || null,
            make: vehicle.make,
            model: vehicle.model,
          },
        },
      });

      return successResponse(updated);
    }

    return errorResponse("Invalid action", 400);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole("ADMIN");
    const adminId = (session.user as { id: string }).id;
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
        hostId: body.hostId || adminId,
        status: "ACTIVE",
        isCompanyOwned: !body.hostId,
        approvedBy: adminId,
        approvedAt: new Date(),
        features: features
          ? { create: features.map((name: string) => ({ name })) }
          : undefined,
      },
      include: { features: true, images: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE_VEHICLE",
        entity: "Vehicle",
        entityId: vehicle.id,
        details: { make: vehicle.make, model: vehicle.model },
      },
    });

    return successResponse(vehicle, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
