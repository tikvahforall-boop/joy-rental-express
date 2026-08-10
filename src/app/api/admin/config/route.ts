import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireRole,
} from "@/lib/api-utils";

export async function GET() {
  try {
    await requireRole("ADMIN");

    const configs = await prisma.appConfiguration.findMany({
      orderBy: { category: "asc" },
    });

    return successResponse(configs);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole("ADMIN");
    const userId = (session.user as { id: string }).id;
    const body = await request.json();

    const { key, value, category } = body;

    if (!key) return errorResponse("Key is required", 400);

    const config = await prisma.appConfiguration.upsert({
      where: { key },
      update: { value, category, updatedBy: userId },
      create: { key, value, category, updatedBy: userId },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "UPDATE_CONFIG",
        entity: "AppConfiguration",
        entityId: config.id,
        details: { key, value },
      },
    });

    return successResponse(config);
  } catch (error) {
    return handleApiError(error);
  }
}
