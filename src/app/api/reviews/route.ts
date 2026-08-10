import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
  requireAuth,
} from "@/lib/api-utils";
import { reviewSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where: Record<string, unknown> = { isPublished: true };
    if (vehicleId) where.vehicleId = vehicleId;
    if (userId) where.subjectId = userId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, firstName: true, avatarUrl: true },
          },
          vehicle: {
            select: { id: true, make: true, model: true, year: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return successResponse({
      reviews,
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
    const validated = reviewSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { id: validated.bookingId },
      include: { vehicle: true },
    });

    if (!booking) return errorResponse("Booking not found", 404);
    if (booking.status !== "COMPLETED")
      return errorResponse("Can only review completed trips", 400);
    if (booking.renterId !== userId && booking.hostId !== userId)
      return errorResponse("Forbidden", 403);

    const existing = await prisma.review.findUnique({
      where: {
        bookingId_authorId: {
          bookingId: validated.bookingId,
          authorId: userId,
        },
      },
    });
    if (existing) return errorResponse("You already reviewed this trip", 400);

    const isRenterReview = booking.renterId === userId;
    const subjectId = isRenterReview ? booking.hostId : booking.renterId;

    const review = await prisma.review.create({
      data: {
        bookingId: validated.bookingId,
        vehicleId: isRenterReview ? booking.vehicleId : null,
        authorId: userId,
        subjectId,
        type: isRenterReview ? "renter_to_host" : "host_to_renter",
        overallRating: validated.overallRating,
        cleanliness: validated.cleanliness,
        communication: validated.communication,
        accuracy: validated.accuracy,
        pickupExperience: validated.pickupExperience,
        vehicleCondition: validated.vehicleCondition,
        comment: validated.comment,
        isPublished: true,
        publishAt: new Date(),
      },
    });

    if (isRenterReview && booking.vehicleId) {
      const vehicleReviews = await prisma.review.aggregate({
        where: { vehicleId: booking.vehicleId, isPublished: true },
        _avg: { overallRating: true },
        _count: true,
      });
      await prisma.vehicle.update({
        where: { id: booking.vehicleId },
        data: {
          avgRating: vehicleReviews._avg.overallRating,
          totalReviews: vehicleReviews._count,
        },
      });
    }

    return successResponse(review, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
