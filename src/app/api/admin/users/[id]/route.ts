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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isBanned: true,
        banReason: true,
        avatarUrl: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
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
        _count: {
          select: {
            bookingsAsRenter: true,
            bookingsAsHost: true,
            vehicles: true,
            reviewsGiven: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
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

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return errorResponse("User not found", 404);
    }

    if (body.action === "ban") {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          isBanned: true,
          banReason: body.banReason || null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "BAN_USER",
          entity: "User",
          entityId: id,
          details: { banReason: body.banReason || null },
        },
      });

      return successResponse(updated);
    }

    if (body.action === "unban") {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          isBanned: false,
          banReason: null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "UNBAN_USER",
          entity: "User",
          entityId: id,
          details: {},
        },
      });

      return successResponse(updated);
    }

    if (body.role) {
      const validRoles = ["RENTER", "HOST", "ADMIN"];
      if (!validRoles.includes(body.role)) {
        return errorResponse("Invalid role", 400);
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { role: body.role },
      });

      await prisma.auditLog.create({
        data: {
          userId: adminId,
          action: "CHANGE_ROLE",
          entity: "User",
          entityId: id,
          details: { previousRole: user.role, newRole: body.role },
        },
      });

      return successResponse(updated);
    }

    return errorResponse("Invalid request body", 400);
  } catch (error) {
    return handleApiError(error);
  }
}
