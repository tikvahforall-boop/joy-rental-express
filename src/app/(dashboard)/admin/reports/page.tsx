"use client";

import { useState, useEffect } from "react";
import { BarChart3, ShieldAlert, TrendingUp, Users, Car, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface ReportData {
  totalUsers: number;
  totalHosts: number;
  totalVehicles: number;
  totalBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  bookingsByStatus: Record<string, number>;
  revenueByMonth: { month: string; revenue: number }[];
}

export default function AdminReportsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!authorized) return;
    async function fetchReports() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/reports");
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [authorized]);

  if (authorized === null) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
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
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard icon={Users} label="Total Users" value={String(data.totalUsers)} color="blue" />
            <MetricCard icon={Users} label="Total Hosts" value={String(data.totalHosts)} color="green" />
            <MetricCard icon={Car} label="Active Vehicles" value={String(data.totalVehicles)} color="purple" />
            <MetricCard icon={BarChart3} label="Total Bookings" value={String(data.totalBookings)} color="amber" />
            <MetricCard icon={DollarSign} label="Total Revenue" value={formatCurrency(data.totalRevenue)} color="green" />
            <MetricCard icon={TrendingUp} label="Avg Booking Value" value={formatCurrency(data.avgBookingValue)} color="blue" />
          </div>

          {data.bookingsByStatus && Object.keys(data.bookingsByStatus).length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Bookings by Status</h2>
                <div className="space-y-3">
                  {Object.entries(data.bookingsByStatus).map(([status, count]) => {
                    const max = Math.max(...Object.values(data.bookingsByStatus));
                    const pct = max > 0 ? (count / max) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center gap-4">
                        <span className="w-40 text-sm text-gray-600">{status.replace(/_/g, " ")}</span>
                        <div className="flex-1">
                          <div className="h-6 rounded-full bg-gray-100">
                            <div
                              className="flex h-6 items-center justify-end rounded-full bg-green-500 px-2 text-xs font-medium text-white"
                              style={{ width: `${Math.max(pct, 8)}%` }}
                            >
                              {count}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {data.revenueByMonth && data.revenueByMonth.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue by Month</h2>
                <div className="space-y-3">
                  {data.revenueByMonth.map((item) => {
                    const max = Math.max(...data.revenueByMonth.map((m) => m.revenue));
                    const pct = max > 0 ? (item.revenue / max) * 100 : 0;
                    return (
                      <div key={item.month} className="flex items-center gap-4">
                        <span className="w-24 text-sm text-gray-600">{item.month}</span>
                        <div className="flex-1">
                          <div className="h-6 rounded-full bg-gray-100">
                            <div
                              className="flex h-6 items-center justify-end rounded-full bg-amber-500 px-2 text-xs font-medium text-white"
                              style={{ width: `${Math.max(pct, 12)}%` }}
                            >
                              {formatCurrency(item.revenue)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">No report data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-lg p-2.5 ${colors[color] || "bg-gray-50 text-gray-600"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
