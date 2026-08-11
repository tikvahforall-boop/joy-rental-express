"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Car,
  CalendarDays,
  DollarSign,
  Percent,
  XCircle,
  ArrowRight,
  Shield,
  AlertTriangle,
  Settings,
  CreditCard,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface AdminStats {
  users: { total: number; hosts: number; renters: number };
  vehicles: { total: number; active: number };
  bookings: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    cancellationRate: number;
  };
  financials: {
    grossBookingValue: number;
    platformFees: number;
    serviceFees: number;
    totalPayouts: number;
    totalRefunds: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (!session?.user || session.user.role !== "ADMIN") {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        setAuthorized(true);
        fetchStats();
      } catch {
        setAuthorized(false);
        setLoading(false);
      }
    }

    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (authorized === false) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              You do not have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <Skeleton className="mb-1 h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="mb-2 h-5 w-24" />
                  <Skeleton className="h-4 w-36" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <AlertTriangle className="h-6 w-6 text-neutral-600" />
            </div>
            <CardTitle>Failed to Load Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Total Users",
      value: stats.users.total.toLocaleString(),
      description: `${stats.users.hosts} hosts, ${stats.users.renters} renters`,
      icon: Users,
      bgColor: "bg-neutral-100",
      iconColor: "text-neutral-800",
    },
    {
      label: "Active Vehicles",
      value: stats.vehicles.active.toLocaleString(),
      description: `${stats.vehicles.total} total vehicles`,
      icon: Car,
      bgColor: "bg-neutral-100",
      iconColor: "text-neutral-800",
    },
    {
      label: "Total Bookings",
      value: stats.bookings.total.toLocaleString(),
      description: `${stats.bookings.confirmed} confirmed, ${stats.bookings.completed} completed`,
      icon: CalendarDays,
      bgColor: "bg-neutral-100",
      iconColor: "text-neutral-800",
    },
    {
      label: "Gross Booking Value",
      value: formatCurrency(stats.financials.grossBookingValue),
      description: "Total value of all qualifying bookings",
      icon: DollarSign,
      bgColor: "bg-neutral-100",
      iconColor: "text-neutral-600",
    },
    {
      label: "Platform Fees",
      value: formatCurrency(stats.financials.platformFees),
      description: "Fees collected from hosts",
      icon: Percent,
      bgColor: "bg-neutral-100",
      iconColor: "text-neutral-600",
    },
    {
      label: "Service Fees",
      value: formatCurrency(stats.financials.serviceFees),
      description: "Fees collected from renters",
      icon: CreditCard,
      bgColor: "bg-neutral-100",
      iconColor: "text-neutral-600",
    },
    {
      label: "Total Payouts",
      value: formatCurrency(stats.financials.totalPayouts),
      description: "Paid out to hosts",
      icon: Wallet,
      bgColor: "bg-neutral-100",
      iconColor: "text-neutral-800",
    },
    {
      label: "Cancellation Rate",
      value: `${stats.bookings.cancellationRate}%`,
      description: `${stats.bookings.cancelled} cancelled bookings`,
      icon: XCircle,
      bgColor:
        stats.bookings.cancellationRate > 10 ? "bg-red-100" : "bg-neutral-100",
      iconColor:
        stats.bookings.cancellationRate > 10
          ? "text-red-600"
          : "text-neutral-600",
    },
  ];

  const quickLinks = [
    {
      label: "Manage Users",
      description: "Manage user accounts and roles",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Manage Vehicles",
      description: "Review and manage vehicle listings",
      href: "/admin/vehicles",
      icon: Car,
    },
    {
      label: "Manage Bookings",
      description: "View and manage all bookings",
      href: "/admin/bookings",
      icon: CalendarDays,
    },
    {
      label: "Platform Settings",
      description: "Platform configuration and fees",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform overview and key metrics
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {card.description}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${card.bgColor}`}
                >
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
                    <link.icon className="h-5 w-5 text-neutral-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {link.label}
                    </p>
                    <p className="text-xs text-gray-500">{link.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
