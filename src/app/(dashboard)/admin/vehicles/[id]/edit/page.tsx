"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleForm } from "@/components/admin/vehicle-form";

export default function AdminEditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [vehicle, setVehicle] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data?.user?.role === "ADMIN"))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`/api/admin/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setVehicle(null);
        } else {
          setVehicle({
            ...data,
            features: (data.features || []).map(
              (f: { name: string }) => f.name
            ),
          });
        }
      })
      .catch(() => setVehicle(null))
      .finally(() => setLoading(false));
  }, [isAdmin, id]);

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
          <CardContent className="text-center">
            <p className="text-gray-500">Admin privileges are required.</p>
          </CardContent>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/vehicles/${id}`}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Vehicle
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        Edit: {vehicle.year as number} {vehicle.make as string}{" "}
        {vehicle.model as string}
      </h1>
      <VehicleForm
        mode="edit"
        initialData={vehicle as unknown as Parameters<typeof VehicleForm>[0]["initialData"]}
      />
    </div>
  );
}
