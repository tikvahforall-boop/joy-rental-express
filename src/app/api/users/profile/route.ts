import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  handleApiError,
  requireAuth,
} from "@/lib/api-utils";
import { profileUpdateSchema } from "@/lib/validators";

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        identityVerification: {
          select: { status: true, createdAt: true },
        },
        driverLicenseVerification: {
          select: { status: true, expirationDate: true, createdAt: true },
        },
        hostProfile: true,
        renterProfile: true,
      },
    });

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const validated = profileUpdateSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (validated.firstName) updateData.firstName = validated.firstName;
    if (validated.lastName) updateData.lastName = validated.lastName;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.dateOfBirth)
      updateData.dateOfBirth = new Date(validated.dateOfBirth);

    if (validated.firstName || validated.lastName) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, lastName: true },
      });
      updateData.name = `${validated.firstName ?? user?.firstName ?? ""} ${validated.lastName ?? user?.lastName ?? ""}`.trim();
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        dateOfBirth: true,
        role: true,
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
