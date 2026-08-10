import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "IN_PROGRESS", "COMPLETED", "CLOSED"] },
    },
    include: {
      vehicle: { select: { make: true, model: true } },
      renter: { select: { name: true, firstName: true } },
      host: { select: { name: true, firstName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const payments = bookings.map((b) => {
    const hostPayout = b.totalPrice - b.platformFee - b.serviceFee;
    return {
      id: b.id,
      bookingRef: b.bookingRef,
      amount: b.totalPrice,
      platformFee: b.platformFee,
      hostPayout,
      status: b.status,
      method: "card",
      createdAt: b.createdAt.toISOString(),
      renterName: b.renter.name || b.renter.firstName || "Unknown",
      hostName: b.host.name || b.host.firstName || "Unknown",
    };
  });

  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalFees = payments.reduce((s, p) => s + p.platformFee, 0);
  const pendingPayouts = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((s, p) => s + p.hostPayout, 0);

  return NextResponse.json({
    payments,
    stats: {
      totalRevenue,
      totalFees,
      pendingPayouts,
      transactionCount: payments.length,
    },
  });
}
