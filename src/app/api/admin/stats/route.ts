import { prisma } from "@/lib/db";
import { successResponse, handleApiError, requireRole } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireRole("ADMIN");

    const [
      totalUsers,
      totalHosts,
      totalRenters,
      totalVehicles,
      activeVehicles,
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      revenueResult,
      payoutsResult,
      refundsResult,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "HOST" } }),
      prisma.user.count({ where: { role: "RENTER" } }),
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "ACTIVE" } }),
      prisma.booking.count(),
      prisma.booking.count({
        where: { status: { in: ["CONFIRMED", "PICKUP_READY", "IN_PROGRESS"] } },
      }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({
        where: {
          status: { in: ["CANCELLED_BY_RENTER", "CANCELLED_BY_HOST"] },
        },
      }),
      prisma.booking.aggregate({
        where: { status: { in: ["CONFIRMED", "COMPLETED", "IN_PROGRESS"] } },
        _sum: { totalPrice: true, platformFee: true, serviceFee: true },
      }),
      prisma.payout.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.refund.aggregate({
        where: { status: "succeeded" },
        _sum: { amount: true },
      }),
    ]);

    const cancellationRate =
      totalBookings > 0
        ? Math.round((cancelledBookings / totalBookings) * 100)
        : 0;

    return successResponse({
      users: { total: totalUsers, hosts: totalHosts, renters: totalRenters },
      vehicles: { total: totalVehicles, active: activeVehicles },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        cancellationRate,
      },
      financials: {
        grossBookingValue: revenueResult._sum.totalPrice ?? 0,
        platformFees: revenueResult._sum.platformFee ?? 0,
        serviceFees: revenueResult._sum.serviceFee ?? 0,
        totalPayouts: payoutsResult._sum.amount ?? 0,
        totalRefunds: refundsResult._sum.amount ?? 0,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
