"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Eye, CalendarRange, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";

interface Booking {
  id: string;
  bookingRef: string;
  status: keyof typeof BOOKING_STATUSES;
  pickupDate: string;
  returnDate: string;
  totalPrice: number;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
  };
  renter: {
    id: string;
    name: string | null;
    firstName: string | null;
  };
  host: {
    id: string;
    name: string | null;
    firstName: string | null;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...Object.entries(BOOKING_STATUSES).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const session = await res.json();
          if (session?.user?.role === "ADMIN") {
            setAuthorized(true);
            return;
          }
        }
        setAuthorized(false);
      } catch {
        setAuthorized(false);
      }
    }
    checkAccess();
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/bookings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        }));
      }
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, search]);

  useEffect(() => {
    if (authorized) {
      fetchBookings();
    }
  }, [authorized, fetchBookings]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getUserName = (user: { name: string | null; firstName: string | null }) => {
    return user.name || user.firstName || "Unknown";
  };

  if (authorized === null) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="mb-4 rounded-full bg-red-100 p-4">
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-sm text-gray-500">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by booking ref..."
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
        <div className="max-w-xs">
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <CalendarRange className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-900">No bookings found</p>
            <p className="text-sm text-gray-500">
              {search || statusFilter
                ? "Try adjusting your search or filters."
                : "There are no bookings yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      <th className="whitespace-nowrap px-4 py-3">Ref</th>
                      <th className="whitespace-nowrap px-4 py-3">Vehicle</th>
                      <th className="whitespace-nowrap px-4 py-3">Renter</th>
                      <th className="whitespace-nowrap px-4 py-3">Host</th>
                      <th className="whitespace-nowrap px-4 py-3">Dates</th>
                      <th className="whitespace-nowrap px-4 py-3">Status</th>
                      <th className="whitespace-nowrap px-4 py-3">Total</th>
                      <th className="whitespace-nowrap px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-medium text-gray-900">
                          {booking.bookingRef}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {booking.vehicle.make} {booking.vehicle.model}{" "}
                          {booking.vehicle.year}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {getUserName(booking.renter)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {getUserName(booking.host)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {formatDate(booking.pickupDate)} &ndash;{" "}
                          {formatDate(booking.returnDate)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                          {formatCurrency(booking.totalPrice)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <Link href={`/admin/bookings/${booking.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} bookings
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
