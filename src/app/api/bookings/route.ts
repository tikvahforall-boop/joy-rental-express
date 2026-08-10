import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireAuth,
} from "@/lib/api-utils";
import { bookingCreateSchema } from "@/lib/validators";
import { calculatePricing } from "@/lib/services/pricing-service";
import { generateBookingRef } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const userRole = (session.user as { role?: string }).role;
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where: Record<string, unknown> = {};

    if (userRole === "ADMIN") {
      // admin sees all
    } else if (userRole === "HOST") {
      where.hostId = userId;
    } else {
      where.renterId = userId;
    }

    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              slug: true,
              city: true,
              state: true,
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          renter: {
            select: { id: true, name: true, firstName: true, avatarUrl: true },
          },
          host: {
            select: { id: true, name: true, firstName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return successResponse({
      bookings,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const validated = bookingCreateSchema.parse(body);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: validated.vehicleId },
      include: { addOns: { where: { isActive: true } } },
    });

    if (!vehicle) return errorResponse("Vehicle not found", 404);
    if (vehicle.status !== "ACTIVE")
      return errorResponse("Vehicle is not available", 400);
    if (vehicle.hostId === userId)
      return errorResponse("Cannot book your own vehicle", 400);

    const pickupDate = new Date(validated.pickupDate);
    const returnDate = new Date(validated.returnDate);

    if (pickupDate >= returnDate)
      return errorResponse("Return date must be after pickup date", 400);

    const overlapping = await prisma.booking.findFirst({
      where: {
        vehicleId: validated.vehicleId,
        status: {
          in: [
            "CONFIRMED",
            "PICKUP_READY",
            "IN_PROGRESS",
            "PENDING_APPROVAL",
          ],
        },
        OR: [
          {
            pickupDate: { lte: returnDate },
            returnDate: { gte: pickupDate },
          },
        ],
      },
    });

    if (overlapping) {
      return errorResponse(
        "Vehicle is not available for the selected dates",
        409
      );
    }

    const config = await prisma.appConfiguration.findMany({
      where: { category: "fees" },
    });
    const hostFeeConfig = config.find((c) => c.key === "host_fee_rate");
    const renterFeeConfig = config.find((c) => c.key === "renter_fee_rate");
    const hostFeeRate = hostFeeConfig
      ? (hostFeeConfig.value as number)
      : 12;
    const renterFeeRate = renterFeeConfig
      ? (renterFeeConfig.value as number)
      : 10;

    const selectedAddOns = validated.addOns
      ? vehicle.addOns.filter((a) => validated.addOns!.includes(a.id))
      : [];

    const pricing = calculatePricing({
      dailyPrice: vehicle.dailyPrice,
      pickupDate,
      returnDate,
      weeklyDiscount: vehicle.weeklyDiscount,
      monthlyDiscount: vehicle.monthlyDiscount,
      cleaningFee: vehicle.cleaningFee,
      deliveryFee: vehicle.deliveryFee,
      isDelivery: validated.pickupType === "delivery",
      addOns: selectedAddOns.map((a) => ({
        pricePerDay: a.pricePerDay,
        name: a.name,
      })),
      hostFeeRate,
      renterFeeRate,
      taxRate: 8.5,
    });

    const bookingRef = generateBookingRef();

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          bookingRef,
          vehicleId: validated.vehicleId,
          renterId: userId,
          hostId: vehicle.hostId,
          status:
            vehicle.bookingMode === "INSTANT"
              ? "CONFIRMED"
              : "PENDING_APPROVAL",
          pickupDate,
          returnDate,
          pickupType: validated.pickupType,
          pickupAddress: validated.pickupAddress,
          dailyRate: pricing.dailyRate,
          numDays: pricing.numDays,
          subtotal: pricing.subtotal,
          deliveryFee: pricing.deliveryFee,
          cleaningFee: pricing.cleaningFee,
          airportFee: pricing.airportFee,
          addOnTotal: pricing.addOnTotal,
          insuranceFee: pricing.insuranceFee,
          serviceFee: pricing.serviceFee,
          taxAmount: pricing.taxAmount,
          depositAmount: pricing.depositAmount,
          totalPrice: pricing.totalPrice,
          hostEarnings: pricing.hostEarnings,
          platformFee: pricing.platformFee,
          platformFeeRate: hostFeeRate,
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: newBooking.id,
          status: newBooking.status,
          changedBy: userId,
        },
      });

      const breakdownItems = [
        {
          label: `${pricing.numDays} day(s) × $${pricing.dailyRate}`,
          type: "base",
          amount: pricing.dailyRate,
          quantity: pricing.numDays,
          total: pricing.dailyRate * pricing.numDays,
        },
      ];

      if (pricing.weeklyDiscount > 0)
        breakdownItems.push({
          label: "Weekly discount",
          type: "discount",
          amount: -pricing.weeklyDiscount,
          quantity: 1,
          total: -pricing.weeklyDiscount,
        });
      if (pricing.cleaningFee > 0)
        breakdownItems.push({
          label: "Cleaning fee",
          type: "fee",
          amount: pricing.cleaningFee,
          quantity: 1,
          total: pricing.cleaningFee,
        });
      if (pricing.deliveryFee > 0)
        breakdownItems.push({
          label: "Delivery fee",
          type: "fee",
          amount: pricing.deliveryFee,
          quantity: 1,
          total: pricing.deliveryFee,
        });
      if (pricing.serviceFee > 0)
        breakdownItems.push({
          label: "Service fee",
          type: "fee",
          amount: pricing.serviceFee,
          quantity: 1,
          total: pricing.serviceFee,
        });
      if (pricing.taxAmount > 0)
        breakdownItems.push({
          label: "Taxes",
          type: "tax",
          amount: pricing.taxAmount,
          quantity: 1,
          total: pricing.taxAmount,
        });

      if (breakdownItems.length > 0) {
        await tx.bookingPriceBreakdown.createMany({
          data: breakdownItems.map((item) => ({
            bookingId: newBooking.id,
            ...item,
          })),
        });
      }

      if (selectedAddOns.length > 0) {
        await tx.bookingAddOn.createMany({
          data: selectedAddOns.map((addOn) => ({
            bookingId: newBooking.id,
            addOnId: addOn.id,
            name: addOn.name,
            pricePerDay: addOn.pricePerDay,
            numDays: pricing.numDays,
            total: addOn.pricePerDay * pricing.numDays,
          })),
        });
      }

      return newBooking;
    });

    const fullBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            slug: true,
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
        priceBreakdown: true,
        addOnSelections: true,
      },
    });

    return successResponse(fullBooking, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
