import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireRole,
} from "@/lib/api-utils";
import { vehiclePricingRuleSchema } from "@/lib/validators";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole("ADMIN");
    const { id } = await params;

    const rules = await prisma.vehiclePricingRule.findMany({
      where: { vehicleId: id },
      orderBy: { startDate: "asc" },
    });

    return successResponse(rules);
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

    const validated = vehiclePricingRuleSchema.parse(body);

    const startDate = new Date(validated.startDate);
    const endDate = new Date(validated.endDate);

    if (startDate >= endDate) {
      return errorResponse("Start date must be before end date", 400);
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return errorResponse("Vehicle not found", 404);

    const rule = await prisma.vehiclePricingRule.create({
      data: {
        vehicleId: id,
        name: validated.name,
        type: validated.type,
        value: validated.value,
        startDate,
        endDate,
        isActive: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE_PRICING_RULE",
        entity: "Vehicle",
        entityId: id,
        details: {
          name: validated.name,
          type: validated.type,
          value: validated.value,
        },
      },
    });

    return successResponse(rule, 201);
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
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get("ruleId");

    if (!ruleId) return errorResponse("ruleId is required", 400);

    const rule = await prisma.vehiclePricingRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule || rule.vehicleId !== id) {
      return errorResponse("Pricing rule not found", 404);
    }

    const updated = await prisma.vehiclePricingRule.update({
      where: { id: ruleId },
      data: { isActive: !rule.isActive },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "UPDATE_PRICING_RULE",
        entity: "Vehicle",
        entityId: id,
        details: { name: rule.name, isActive: updated.isActive },
      },
    });

    return successResponse(updated);
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
    const ruleId = searchParams.get("ruleId");

    if (!ruleId) return errorResponse("ruleId is required", 400);

    const rule = await prisma.vehiclePricingRule.findUnique({
      where: { id: ruleId },
    });

    if (!rule || rule.vehicleId !== id) {
      return errorResponse("Pricing rule not found", 404);
    }

    await prisma.vehiclePricingRule.delete({ where: { id: ruleId } });

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "DELETE_PRICING_RULE",
        entity: "Vehicle",
        entityId: id,
        details: { name: rule.name },
      },
    });

    return successResponse({ message: "Pricing rule removed" });
  } catch (error) {
    return handleApiError(error);
  }
}
