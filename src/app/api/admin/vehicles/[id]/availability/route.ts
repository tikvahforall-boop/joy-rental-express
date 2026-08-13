import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireRole,
} from "@/lib/api-utils";
import { vehicleAvailabilitySchema } from "@/lib/validators";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;

    const blocks = await prisma.vehicleAvailability.findMany({
      where: { vehicleId: id, isBlocked: true },
      orderBy: { startDate: "asc" },
    });

    return successResponse(blocks);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole("ADMIN");
    const adminId = (session.user as { id: string }).id;
    const { id } = await params;
    const body = await request.json();

    const validated = vehicleAvailabilitySchema.parse(body);

    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);

    if (startDate >= endDate) {
      return errorResponse("Start date must be before end date", 400);
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return errorResponse("Vehicle not found", 404);

    const overlap = await prisma.vehicleAvailability.findFirst({
      where: {
        vehicleId: id,
        isBlocked: true,
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    });

    if (overlap) {
      return errorResponse("Dates overlap with an existing block", 409);
    }

    const block = await prisma.vehicleAvailability.create({
      data: {
        vehicleId: id,
        startDate,
        endDate,
        isBlocked: true,
        reason: validated.reason || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "BLOCK_VEHICLE_DATES",
        entity: "Vehicle",
        entityId: id,
        details: {
          startDate: validated.startDate,
          endDate: validated.endDate,
          reason: validated.reason || null,
        },
      },
    });

    return successResponse(block, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole("ADMIN");
    const adminId = (session.user as { id: string }).id;
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get("blockId");

    if (!blockId) return errorResponse("blockId is required", 400);

    const block = await prisma.vehicleAvailability.findUnique({
      where: { id: blockId },
    });

    if (!block || block.vehicleId !== id) {
      return errorResponse("Block not found", 404);
    }

    await prisma.vehicleAvailability.delete({ where: { id: blockId } });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "UNBLOCK_VEHICLE_DATES",
        entity: "Vehicle",
        entityId: id,
        details: {
          startDate: block.startDate.toISOString(),
          endDate: block.endDate.toISOString(),
        },
      },
    });

    return successResponse({ message: "Block removed" });
  } catch (error) {
    return handleApiError(error);
  }
}
