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
        availability: {
          where: { isBlocked: true },
          orderBy: { startDate: "asc" },
        },
        pricingRules: {
          orderBy: { startDate: "asc" },
        },
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

    const { features, primaryImageId, id: _id, images: _imgs, ...rest } = body;

    const allowedFields = [
      "make", "model", "year", "trim", "vin", "licensePlate", "color",
      "category", "description", "seats", "doors", "fuelType", "transmission",
      "drivetrain", "mileage", "electricRange", "address", "city", "state",
      "zipCode", "dailyPrice", "weeklyDiscount", "monthlyDiscount",
      "cleaningFee", "deliveryFee", "dailyMileageLimit", "extraMileCharge",
      "bookingMode", "minTripDays", "maxTripDays", "instantBookEligible",
      "deliveryEnabled", "deliveryRadius",
      "longTermAvailable", "rentToOwnAvailable", "weeklyPrice", "monthlyPrice",
      "purchasePrice", "rtoDownPayment", "rtoMonthlyPayment", "rtoTermMonths",
    ];
    const vehicleData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in rest) vehicleData[key] = rest[key];
    }

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
