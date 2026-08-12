import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireRole,
} from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: "asc" } },
        features: true,
        host: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!vehicle) return errorResponse("Vehicle not found", 404);

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
    const session = await requireRole("ADMIN");
    const adminId = (session.user as { id: string }).id;
    const { id } = await params;
    const body = await request.json();

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return errorResponse("Vehicle not found", 404);

    const { features, primaryImageId, ...vehicleData } = body;

    if (primaryImageId) {
      await prisma.vehicleImage.updateMany({
        where: { vehicleId: id },
        data: { isPrimary: false },
      });
      await prisma.vehicleImage.update({
        where: { id: primaryImageId },
        data: { isPrimary: true },
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: vehicleData,
      include: { images: true, features: true },
    });

    if (features && Array.isArray(features)) {
      await prisma.vehicleFeature.deleteMany({ where: { vehicleId: id } });
      if (features.length > 0) {
        await prisma.vehicleFeature.createMany({
          data: features.map((name: string) => ({ vehicleId: id, name })),
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "UPDATE_VEHICLE",
        entity: "Vehicle",
        entityId: id,
        details: { make: updated.make, model: updated.model },
      },
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
    const session = await requireRole("ADMIN");
    const adminId = (session.user as { id: string }).id;
    const { id } = await params;

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return errorResponse("Vehicle not found", 404);

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "DELETE_VEHICLE",
        entity: "Vehicle",
        entityId: id,
        details: { make: vehicle.make, model: vehicle.model },
      },
    });

    await prisma.vehicle.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    return successResponse({ message: "Vehicle deactivated" });
  } catch (error) {
    return handleApiError(error);
  }
}
