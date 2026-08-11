"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Star, Pencil, Power, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  status: string;
  dailyPrice: number;
  totalTrips: number;
  avgRating: number;
  totalReviews: number;
  category: string;
  city: string;
  state: string;
  images: { url: string; isPrimary: boolean }[];
  features: string[];
  host: { id: string; name: string; avatarUrl: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "SUSPENDED", label: "Suspended" },
];

const STATUS_BADGE_MAP: Record<string, "success" | "outline" | "warning" | "info" | "error"> = {
  ACTIVE: "success",
  INACTIVE: "outline",
  PENDING_APPROVAL: "warning",
  MAINTENANCE: "info",
  SUSPENDED: "error",
  DRAFT: "outline",
};

const STATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING_APPROVAL: "Pending Approval",
  MAINTENANCE: "Maintenance",
  SUSPENDED: "Suspended",
  DRAFT: "Draft",
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (statusFilter) {
        params.set("status", statusFilter);
      }
      const res = await fetch(`/api/vehicles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVehicles(data.vehicles || []);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        }));
      }
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDeactivate = async (id: string) => {
    setDeactivatingId(id);
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchVehicles();
      }
    } catch {
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
        <Link href="/dashboard/vehicles/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      <div className="max-w-xs">
        <Select
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={handleStatusChange}
          placeholder="Filter by status"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-xl rounded-b-none" />
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-900">No vehicles yet</p>
            <p className="mb-6 text-sm text-gray-500">
              List your first vehicle to start earning!
            </p>
            <Link href="/dashboard/vehicles/new">
              <Button>
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <div className="flex h-48 items-center justify-center bg-gray-100">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images.find((img) => img.isPrimary)?.url || vehicle.images[0]?.url}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Car className="h-12 w-12 text-gray-300" />
                  )}
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <Badge variant={STATUS_BADGE_MAP[vehicle.status] || "outline"}>
                      {STATUS_LABEL_MAP[vehicle.status] || vehicle.status}
                    </Badge>
                  </div>

                  <p className="text-lg font-bold text-neutral-800">
                    {formatCurrency(vehicle.dailyPrice)}{" "}
                    <span className="text-sm font-normal text-gray-500">/day</span>
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{vehicle.totalTrips} trips</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-neutral-400 text-neutral-400" />
                      {vehicle.avgRating > 0 ? vehicle.avgRating.toFixed(1) : "N/A"}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link href={`/dashboard/vehicles/${vehicle.slug || vehicle.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeactivate(vehicle.id)}
                      loading={deactivatingId === vehicle.id}
                    >
                      <Power className="h-3.5 w-3.5" />
                      Deactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={pagination.page === i + 1 ? "default" : "ghost"}
                    size="sm"
                    className="min-w-[36px]"
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
