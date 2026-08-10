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
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const userRole = (session.user as { role?: string }).role;
    const { id } = await params;

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id }, { bookingRef: id }],
      },
      include: {
        vehicle: {
          include: {
            images: { orderBy: { position: "asc" } },
            host: {
              select: {
                id: true,
                name: true,
                firstName: true,
                avatarUrl: true,
                phone: true,
              },
            },
          },
        },
        renter: {
          select: {
            id: true,
            name: true,
            firstName: true,
            avatarUrl: true,
            phone: true,
          },
        },
        priceBreakdown: true,
        addOnSelections: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
        checkInOutReports: true,
        reviews: true,
        insuranceQuote: true,
        insurancePolicy: true,
      },
    });

    if (!booking) return errorResponse("Booking not found", 404);

    if (
      userRole !== "ADMIN" &&
      booking.renterId !== userId &&
      booking.hostId !== userId
    ) {
      return errorResponse("Forbidden", 403);
    }

    return successResponse(booking);
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
    const userRole = (session.user as { role?: string }).role;
    const { id } = await params;
    const body = await request.json();

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return errorResponse("Booking not found", 404);

    if (
      userRole !== "ADMIN" &&
      booking.renterId !== userId &&
      booking.hostId !== userId
    ) {
      return errorResponse("Forbidden", 403);
    }

    const { action } = body;

    switch (action) {
      case "approve": {
        if (booking.hostId !== userId && userRole !== "ADMIN")
          return errorResponse("Only host can approve", 403);
        if (booking.status !== "PENDING_APPROVAL")
          return errorResponse("Booking cannot be approved in current state", 400);

        const updated = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({
            where: { id },
            data: { status: "CONFIRMED" },
          });
          await tx.bookingStatusHistory.create({
            data: { bookingId: id, status: "CONFIRMED", changedBy: userId },
          });
          return b;
        });
        return successResponse(updated);
      }

      case "decline": {
        if (booking.hostId !== userId && userRole !== "ADMIN")
          return errorResponse("Only host can decline", 403);
        if (booking.status !== "PENDING_APPROVAL")
          return errorResponse("Booking cannot be declined in current state", 400);

        const updated = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({
            where: { id },
            data: {
              status: "DECLINED",
              cancelledAt: new Date(),
              cancelledBy: userId,
              cancellationReason: body.reason,
            },
          });
          await tx.bookingStatusHistory.create({
            data: {
              bookingId: id,
              status: "DECLINED",
              changedBy: userId,
              note: body.reason,
            },
          });
          return b;
        });
        return successResponse(updated);
      }

      case "cancel": {
        const cancelableStatuses = [
          "PENDING_PAYMENT",
          "PENDING_APPROVAL",
          "CONFIRMED",
        ];
        if (!cancelableStatuses.includes(booking.status))
          return errorResponse("Booking cannot be cancelled in current state", 400);

        const cancelStatus =
          booking.renterId === userId
            ? "CANCELLED_BY_RENTER"
            : "CANCELLED_BY_HOST";

        const updated = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({
            where: { id },
            data: {
              status: cancelStatus as "CANCELLED_BY_RENTER" | "CANCELLED_BY_HOST",
              cancelledAt: new Date(),
              cancelledBy: userId,
              cancellationReason: body.reason,
            },
          });
          await tx.bookingStatusHistory.create({
            data: {
              bookingId: id,
              status: cancelStatus as "CANCELLED_BY_RENTER" | "CANCELLED_BY_HOST",
              changedBy: userId,
              note: body.reason,
            },
          });
          return b;
        });
        return successResponse(updated);
      }

      case "start_trip": {
        if (booking.status !== "CONFIRMED" && booking.status !== "PICKUP_READY")
          return errorResponse("Booking must be confirmed to start trip", 400);

        const updated = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({
            where: { id },
            data: {
              status: "IN_PROGRESS",
              actualPickupDate: new Date(),
            },
          });
          await tx.bookingStatusHistory.create({
            data: {
              bookingId: id,
              status: "IN_PROGRESS",
              changedBy: userId,
            },
          });
          return b;
        });
        return successResponse(updated);
      }

      case "complete": {
        if (booking.status !== "IN_PROGRESS" && booking.status !== "RETURN_PENDING")
          return errorResponse("Trip must be in progress to complete", 400);

        const updated = await prisma.$transaction(async (tx) => {
          const b = await tx.booking.update({
            where: { id },
            data: {
              status: "COMPLETED",
              actualReturnDate: new Date(),
            },
          });
          await tx.bookingStatusHistory.create({
            data: {
              bookingId: id,
              status: "COMPLETED",
              changedBy: userId,
            },
          });
          await tx.vehicle.update({
            where: { id: booking.vehicleId },
            data: { totalTrips: { increment: 1 } },
          });
          return b;
        });
        return successResponse(updated);
      }

      default:
        return errorResponse("Invalid action", 400);
    }
  } catch (error) {
    return handleApiError(error);
  }
}
