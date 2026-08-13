"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  status: string;
  dailyPrice: number;
  totalTrips: number;
  avgRating: number | null;
  category: string;
  slug: string;
  imageUrl: string | null;
  host: {
    id: string;
    name: string;
  };
}

const categoryEmoji: Record<string, string> = {
  economy: "🚗",
  suv: "🚙",
  luxury: "✨",
  electric: "⚡",
  sports: "🏎️",
  van: "🚐",
  truck: "🛻",
  family: "👨‍👩‍👧‍👦",
};

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DRAFT", label: "Draft" },
];

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "economy", label: "Economy" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
  { value: "electric", label: "Electric" },
  { value: "sports", label: "Sports" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" },
  { value: "family", label: "Family" },
];

const statusBadgeVariant: Record<string, "success" | "warning" | "error" | "outline" | "info"> = {
  ACTIVE: "success",
  PENDING_APPROVAL: "warning",
  SUSPENDED: "error",
  INACTIVE: "outline",
  MAINTENANCE: "info",
  DRAFT: "outline",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Active",
  PENDING_APPROVAL: "Pending",
  SUSPENDED: "Suspended",
  INACTIVE: "Inactive",
  MAINTENANCE: "Maintenance",
  DRAFT: "Draft",
};

export default function AdminVehiclesPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data?.user?.role === "ADMIN"))
      .catch(() => setIsAdmin(false));
  }, []);

  const fetchVehicles = useCallback(
    async (page: number) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (category) params.set("category", category);
      params.set("page", String(page));
      params.set("limit", "10");

      try {
        const res = await fetch(`/api/admin/vehicles?${params.toString()}`);
        const data = await res.json();
        let filtered = data.vehicles || [];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (v: Vehicle) =>
              v.make.toLowerCase().includes(q) ||
              v.model.toLowerCase().includes(q) ||
              `${v.year}`.includes(q) ||
              v.host.name.toLowerCase().includes(q)
          );
        }
        setVehicles(filtered);
        setPagination(data.pagination);
      } catch {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    },
    [status, category, searchQuery]
  );

  useEffect(() => {
    if (isAdmin) {
      fetchVehicles(1);
    }
  }, [isAdmin, fetchVehicles]);

  const handleAction = async (vehicleId: string, action: "approve" | "suspend" | "activate") => {
    setActionLoadingId(vehicleId);
    try {
      await fetch("/api/admin/vehicles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: vehicleId, action }),
      });
      await fetchVehicles(pagination.page);
    } catch {
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to deactivate this vehicle?")) return;
    setActionLoadingId(vehicleId);
    try {
      await fetch(`/api/admin/vehicles/${vehicleId}`, { method: "DELETE" });
      await fetchVehicles(pagination.page);
    } catch {
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardHeader className="items-center text-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mb-2" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-500">
              You do not have permission to access this page. Admin privileges are required.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
        <Link href="/admin/vehicles/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search make, model, host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-44">
          <Select
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Vehicle</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Host</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Trips</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Rating</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="px-4 py-3"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-10" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-8 w-32" /></td>
                    </tr>
                  ))
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {vehicle.imageUrl ? (
                            <img
                              src={vehicle.imageUrl}
                              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                              className="h-10 w-14 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 text-lg shrink-0">
                              {categoryEmoji[vehicle.category.toLowerCase()] || "🚗"}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 whitespace-nowrap">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {vehicle.host.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap capitalize">
                        {vehicle.category}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant[vehicle.status] || "outline"}>
                          {statusLabel[vehicle.status] || vehicle.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatCurrency(vehicle.dailyPrice)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {vehicle.totalTrips}
                      </td>
                      <td className="px-4 py-3">
                        {vehicle.avgRating !== null ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {vehicle.avgRating.toFixed(1)}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/admin/vehicles/${vehicle.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          {vehicle.status === "PENDING_APPROVAL" && (
                            <Button
                              size="sm"
                              loading={actionLoadingId === vehicle.id}
                              onClick={() => handleAction(vehicle.id, "approve")}
                            >
                              Approve
                            </Button>
                          )}
                          {vehicle.status === "ACTIVE" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              loading={actionLoadingId === vehicle.id}
                              onClick={() => handleAction(vehicle.id, "suspend")}
                            >
                              Suspend
                            </Button>
                          )}
                          {(vehicle.status === "INACTIVE" || vehicle.status === "SUSPENDED") && (
                            <Button
                              size="sm"
                              loading={actionLoadingId === vehicle.id}
                              onClick={() => handleAction(vehicle.id, "activate")}
                            >
                              Activate
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleDelete(vehicle.id)}
                            disabled={actionLoadingId === vehicle.id}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && vehicles.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-600">
                Showing {startIndex} to {endIndex} of {pagination.total} vehicles
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchVehicles(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchVehicles(pagination.page + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
