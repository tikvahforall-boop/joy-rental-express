import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [totalUsers, totalHosts, totalVehicles, bookings] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "HOST" } }),
    prisma.vehicle.count({ where: { status: "ACTIVE" } }),
    prisma.booking.findMany({
      select: { status: true, totalPrice: true, createdAt: true },
    }),
  ]);

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s: number, b: { totalPrice: number }) => s + b.totalPrice, 0);
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const bookingsByStatus: Record<string, number> = {};
  for (const b of bookings) {
    bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
  }

  const revenueByMonthMap = new Map<string, number>();
  for (const b of bookings) {
    const d = new Date(b.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    revenueByMonthMap.set(key, (revenueByMonthMap.get(key) || 0) + b.totalPrice);
  }
  const revenueByMonth = Array.from(revenueByMonthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));

  return NextResponse.json({
    totalUsers,
    totalHosts,
    totalVehicles,
    totalBookings,
    totalRevenue,
    avgBookingValue,
    bookingsByStatus,
    revenueByMonth,
  });
}
