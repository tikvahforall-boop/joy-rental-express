"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CalendarDays,
  CheckCircle2,
  DollarSign,
  MapPin,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BOOKING_STATUSES } from "@/lib/constants";

type BookingStatus = keyof typeof BOOKING_STATUSES;

type Booking = {
  id: string;
  bookingRef: string;
  status: BookingStatus;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  dailyRate: number;
  numDays: number;
  createdAt: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    slug: string;
    city: string;
    state: string;
    images: { url: string }[];
  };
  renter: { id: string; name: string; firstName: string; avatarUrl: string | null };
  host: { id: string; name: string; firstName: string; avatarUrl: string | null };
};

const UPCOMING_STATUSES = ["CONFIRMED", "PICKUP_READY", "IN_PROGRESS"];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/bookings?limit=100");
        const data = await res.json();
        if (data.bookings) setAllBookings(data.bookings);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const upcoming = allBookings.filter((b) =>
    UPCOMING_STATUSES.includes(b.status)
  );
  const completed = allBookings.filter((b) => b.status === "COMPLETED");
  const totalSpent = allBookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const recentBookings = allBookings.slice(0, 5);

  const userName = session?.user?.name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here&apos;s an overview of your rental activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Upcoming Trips
              </CardTitle>
              <CalendarDays className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{upcoming.length}</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completed Trips
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {completed.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Spent
              </CardTitle>
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalSpent)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Trips
          </h2>
          <Link href="/dashboard/bookings">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <CalendarDays className="mb-2 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">No upcoming trips</p>
              <Link href="/search" className="mt-3">
                <Button size="sm">Find a car</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/bookings`}
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-16 w-24 flex-shrink-0 rounded-lg bg-gray-200" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-gray-900">
                        {booking.vehicle.year} {booking.vehicle.make}{" "}
                        {booking.vehicle.model}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {formatDate(booking.pickupDate)} -{" "}
                        {formatDate(booking.returnDate)}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {booking.vehicle.city}, {booking.vehicle.state}
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Activity
        </h2>

        {recentBookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <Clock className="mb-2 h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-500">No recent activity</p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative space-y-0">
            {recentBookings.map((booking, index) => (
              <div key={booking.id} className="flex gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CalendarDays className="h-4 w-4 text-green-600" />
                  </div>
                  {index < recentBookings.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-gray-200" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {booking.vehicle.year} {booking.vehicle.make}{" "}
                      {booking.vehicle.model}
                    </p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatDate(booking.pickupDate)} -{" "}
                    {formatDate(booking.returnDate)} &middot;{" "}
                    {formatCurrency(booking.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
