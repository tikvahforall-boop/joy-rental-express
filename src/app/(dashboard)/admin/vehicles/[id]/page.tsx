"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ShieldAlert,
  Pencil,
  Trash2,
  Car,
  MapPin,
  DollarSign,
  Fuel,
  Gauge,
  Users,
  Calendar,
  Star,
  CheckCircle,
  Power,
  Loader2,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { VehicleCalendar } from "@/components/admin/vehicle-calendar";
import { formatCurrency } from "@/lib/utils";

interface VehicleDetail {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  vin: string | null;
  licensePlate: string | null;
  color: string | null;
  category: string;
  description: string | null;
  seats: number;
  doors: number;
  fuelType: string;
  transmission: string;
  drivetrain: string | null;
  mileage: number | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  address: string | null;
  dailyPrice: number;
  weeklyDiscount: number | null;
  monthlyDiscount: number | null;
  cleaningFee: number | null;
  deliveryFee: number | null;
  dailyMileageLimit: number | null;
  extraMileCharge: number | null;
  bookingMode: string;
  minTripDays: number;
  maxTripDays: number;
  deliveryEnabled: boolean;
  deliveryRadius: number | null;
  instantBookEligible: boolean;
  isCompanyOwned: boolean;
  status: string;
  totalTrips: number;
  avgRating: number | null;
  totalReviews: number;
  createdAt: string;
  host: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  features: { id: string; name: string }[];
  images: { id: string; url: string; caption: string | null; isPrimary: boolean }[];
}

const statusBadgeVariant: Record<string, "success" | "warning" | "error" | "outline" | "info"> = {
  ACTIVE: "success",
  PENDING_APPROVAL: "warning",
  SUSPENDED: "error",
  INACTIVE: "outline",
  MAINTENANCE: "info",
  DRAFT: "outline",
};

export default function AdminVehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDialog, setActionDialog] = useState<"suspend" | "deactivate" | null>(null);
  const [actionReason, setActionReason] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data?.user?.role === "ADMIN"))
      .catch(() => setIsAdmin(false));
  }, []);

  const fetchVehicle = () => {
    fetch(`/api/admin/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setVehicle(null);
        else setVehicle(data);
      })
      .catch(() => setVehicle(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchVehicle();
  }, [isAdmin, id]);

  const handleActivate = async () => {
    setActivating(true);
    try {
      await fetch("/api/admin/vehicles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "activate" }),
      });
      fetchVehicle();
    } catch {
      // silently fail
    } finally {
      setActivating(false);
    }
  };

  const handleActionConfirm = async () => {
    if (!actionDialog) return;
    setActionLoading(true);
    try {
      await fetch("/api/admin/vehicles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action: actionDialog,
          reason: actionReason || undefined,
        }),
      });
      fetchVehicle();
    } catch {
      // silently fail
    } finally {
      setActionLoading(false);
      setActionDialog(null);
      setActionReason("");
    }
  };

  if (isAdmin === null || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
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
        </Card>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/vehicles"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>
        <p className="text-gray-500">Vehicle not found.</p>
      </div>
    );
  }

  const hostName =
    vehicle.host.name || `${vehicle.host.firstName || ""} ${vehicle.host.lastName || ""}`.trim() || vehicle.host.email;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/vehicles"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Vehicles
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.trim ? ` ${vehicle.trim}` : ""}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <Badge variant={statusBadgeVariant[vehicle.status] || "outline"}>
              {vehicle.status.replace("_", " ")}
            </Badge>
            {vehicle.isCompanyOwned && (
              <Badge variant="info">Company Owned</Badge>
            )}
            <span className="text-sm text-gray-500">ID: {vehicle.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/vehicles/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          {(vehicle.status === "INACTIVE" || vehicle.status === "SUSPENDED") && (
            <Button
              size="sm"
              onClick={handleActivate}
              disabled={activating}
            >
              {activating ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Power className="mr-1.5 h-3.5 w-3.5" />
              )}
              Activate
            </Button>
          )}
          {vehicle.status === "ACTIVE" && (
            <Button
              variant="outline"
              size="sm"
              className="text-orange-600 hover:bg-orange-50"
              onClick={() => { setActionDialog("suspend"); setActionReason(""); }}
            >
              <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
              Suspend
            </Button>
          )}
          {vehicle.status === "ACTIVE" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => { setActionDialog("deactivate"); setActionReason(""); }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Deactivate
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultTab="details">
        <TabList>
          <Tab value="details">Details</Tab>
          <Tab value="calendar">Availability & Pricing</Tab>
        </TabList>

        <TabPanel value="details">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Car className="h-5 w-5" />
                    Vehicle Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-gray-500">Make</dt>
                      <dd className="font-medium text-gray-900">{vehicle.make}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Model</dt>
                      <dd className="font-medium text-gray-900">{vehicle.model}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Year</dt>
                      <dd className="font-medium text-gray-900">{vehicle.year}</dd>
                    </div>
                    {vehicle.trim && (
                      <div>
                        <dt className="text-gray-500">Trim</dt>
                        <dd className="font-medium text-gray-900">{vehicle.trim}</dd>
                      </div>
                    )}
                    {vehicle.vin && (
                      <div className="col-span-2">
                        <dt className="text-gray-500">VIN</dt>
                        <dd className="font-mono font-medium text-gray-900">{vehicle.vin}</dd>
                      </div>
                    )}
                    {vehicle.color && (
                      <div>
                        <dt className="text-gray-500">Color</dt>
                        <dd className="font-medium text-gray-900">{vehicle.color}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500">Category</dt>
                      <dd className="font-medium text-gray-900 capitalize">{vehicle.category}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1 text-gray-500">
                        <Users className="h-3.5 w-3.5" /> Seats
                      </dt>
                      <dd className="font-medium text-gray-900">{vehicle.seats}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Doors</dt>
                      <dd className="font-medium text-gray-900">{vehicle.doors}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-1 text-gray-500">
                        <Fuel className="h-3.5 w-3.5" /> Fuel
                      </dt>
                      <dd className="font-medium text-gray-900">{vehicle.fuelType.replace("_", " ")}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Transmission</dt>
                      <dd className="font-medium text-gray-900 capitalize">{vehicle.transmission.toLowerCase()}</dd>
                    </div>
                    {vehicle.drivetrain && (
                      <div>
                        <dt className="text-gray-500">Drivetrain</dt>
                        <dd className="font-medium text-gray-900">{vehicle.drivetrain}</dd>
                      </div>
                    )}
                    {vehicle.mileage && (
                      <div>
                        <dt className="flex items-center gap-1 text-gray-500">
                          <Gauge className="h-3.5 w-3.5" /> Mileage
                        </dt>
                        <dd className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} mi</dd>
                      </div>
                    )}
                    {vehicle.licensePlate && (
                      <div>
                        <dt className="text-gray-500">License Plate</dt>
                        <dd className="font-medium text-gray-900">{vehicle.licensePlate}</dd>
                      </div>
                    )}
                  </dl>
                  {vehicle.description && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="mt-1 text-sm text-gray-700">{vehicle.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {vehicle.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((f) => (
                        <span
                          key={f.id}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                        >
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Daily Price</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(vehicle.dailyPrice)}
                    </span>
                  </div>
                  {vehicle.weeklyDiscount != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weekly Discount</span>
                      <span className="font-medium">{vehicle.weeklyDiscount}%</span>
                    </div>
                  )}
                  {vehicle.monthlyDiscount != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Discount</span>
                      <span className="font-medium">{vehicle.monthlyDiscount}%</span>
                    </div>
                  )}
                  {vehicle.cleaningFee != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cleaning Fee</span>
                      <span className="font-medium">{formatCurrency(vehicle.cleaningFee)}</span>
                    </div>
                  )}
                  {vehicle.dailyMileageLimit != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mileage Limit</span>
                      <span className="font-medium">{vehicle.dailyMileageLimit} mi/day</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium text-gray-900">
                    {[vehicle.city, vehicle.state].filter(Boolean).join(", ")}
                  </p>
                  {vehicle.address && (
                    <p className="mt-1 text-gray-500">{vehicle.address}</p>
                  )}
                  {vehicle.zipCode && (
                    <p className="text-gray-500">{vehicle.zipCode}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stats & Host</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Host</span>
                    <span className="font-medium">{hostName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3.5 w-3.5" /> Total Trips
                    </span>
                    <span className="font-medium">{vehicle.totalTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Star className="h-3.5 w-3.5" /> Rating
                    </span>
                    <span className="font-medium">
                      {vehicle.avgRating ? `${vehicle.avgRating.toFixed(1)} (${vehicle.totalReviews})` : "No reviews"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-medium">
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel value="calendar">
          <VehicleCalendar
            vehicleId={vehicle.id}
            dailyPrice={vehicle.dailyPrice}
          />
        </TabPanel>
      </Tabs>

      {actionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {actionDialog === "suspend" ? "Suspend Vehicle" : "Deactivate Vehicle"}
              </h3>
              <button
                onClick={() => { setActionDialog(null); setActionReason(""); }}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {actionDialog === "suspend"
                ? `Are you sure you want to suspend "${vehicle.year} ${vehicle.make} ${vehicle.model}"? It will be hidden from search results.`
                : `Are you sure you want to deactivate "${vehicle.year} ${vehicle.make} ${vehicle.model}"? It will be unlisted from the platform.`}
            </p>
            <div className="mb-6">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Reason (optional)
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={
                  actionDialog === "suspend"
                    ? "e.g., Policy violation, Pending investigation..."
                    : "e.g., Owner request, Seasonal removal..."
                }
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => { setActionDialog(null); setActionReason(""); }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleActionConfirm}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : null}
                {actionDialog === "suspend" ? "Suspend Vehicle" : "Deactivate Vehicle"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
