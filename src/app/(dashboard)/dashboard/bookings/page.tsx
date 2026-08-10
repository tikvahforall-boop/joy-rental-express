"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const UPCOMING_STATUSES: BookingStatus[] = [
  "CONFIRMED",
  "PICKUP_READY",
  "IN_PROGRESS",
  "PENDING_APPROVAL",
];

const PAST_STATUSES: BookingStatus[] = ["COMPLETED", "CLOSED"];

const CANCELLED_STATUSES: BookingStatus[] = [
  "CANCELLED_BY_RENTER",
  "CANCELLED_BY_HOST",
  "DECLINED",
];

const CANCELABLE_STATUSES: BookingStatus[] = [
  "PENDING_PAYMENT",
  "PENDING_APPROVAL",
  "CONFIRMED",
];

function BookingCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <Skeleton className="h-24 w-full flex-shrink-0 rounded-lg sm:w-36" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center py-12">
      <Icon className="mb-3 h-12 w-12 text-gray-300" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const getStatusesForTab = useCallback((tab: string): BookingStatus[] => {
    switch (tab) {
      case "upcoming":
        return UPCOMING_STATUSES;
      case "past":
        return PAST_STATUSES;
      case "cancelled":
        return CANCELLED_STATUSES;
      default:
        return UPCOMING_STATUSES;
    }
  }, []);

  const fetchBookings = useCallback(
    async (tab: string, page: number) => {
      setLoading(true);
      try {
        const statuses = getStatusesForTab(tab);
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "10");

        const responses = await Promise.all(
          statuses.map((status) =>
            fetch(`/api/bookings?status=${status}&limit=100`).then((r) =>
              r.json()
            )
          )
        );

        const allBookings: Booking[] = responses.flatMap(
          (r) => r.bookings || []
        );
        allBookings.sort(
          (a, b) =>
            new Date(b.pickupDate).getTime() -
            new Date(a.pickupDate).getTime()
        );

        const total = allBookings.length;
        const totalPages = Math.ceil(total / 10);
        const start = (page - 1) * 10;
        const paged = allBookings.slice(start, start + 10);

        setBookings(paged);
        setPagination({ page, limit: 10, total, totalPages });
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    },
    [getStatusesForTab]
  );

  useEffect(() => {
    fetchBookings(activeTab, 1);
  }, [activeTab, fetchBookings]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (res.ok) {
        fetchBookings(activeTab, pagination.page);
      }
    } catch {
      // handle silently
    } finally {
      setCancellingId(null);
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="h-24 w-full flex-shrink-0 rounded-lg bg-gray-200 sm:w-36" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900">
            {booking.vehicle.year} {booking.vehicle.make}{" "}
            {booking.vehicle.model}
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {booking.vehicle.city}, {booking.vehicle.state}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <StatusBadge status={booking.status} />
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(booking.totalPrice)}
          </p>
          <div className="flex gap-2">
            <Link href={`/dashboard/bookings`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            {CANCELABLE_STATUSES.includes(booking.status) && (
              <Button
                variant="destructive"
                size="sm"
                loading={cancellingId === booking.id}
                onClick={() => handleCancel(booking.id)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all your bookings.
        </p>
      </div>

      <Tabs defaultTab="upcoming" value={activeTab} onChange={handleTabChange}>
        <TabList className="overflow-x-auto">
          <Tab value="upcoming">Upcoming</Tab>
          <Tab value="past">Past</Tab>
          <Tab value="cancelled">Cancelled</Tab>
        </TabList>

        <TabPanel value="upcoming">
          {loading ? (
            <div className="space-y-3">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              message="No upcoming bookings. Browse cars to plan your next trip."
            />
          ) : (
            <div className="space-y-3">
              {bookings.map(renderBookingCard)}
            </div>
          )}
        </TabPanel>

        <TabPanel value="past">
          {loading ? (
            <div className="space-y-3">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={Package}
              message="No past bookings yet. Your completed trips will appear here."
            />
          ) : (
            <div className="space-y-3">
              {bookings.map(renderBookingCard)}
            </div>
          )}
        </TabPanel>

        <TabPanel value="cancelled">
          {loading ? (
            <div className="space-y-3">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={XCircle}
              message="No cancelled bookings."
            />
          ) : (
            <div className="space-y-3">
              {bookings.map(renderBookingCard)}
            </div>
          )}
        </TabPanel>
      </Tabs>

      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => fetchBookings(activeTab, pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchBookings(activeTab, pagination.page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
