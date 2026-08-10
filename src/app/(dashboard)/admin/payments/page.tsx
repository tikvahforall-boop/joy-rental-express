"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, CreditCard, ShieldAlert, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BOOKING_STATUSES } from "@/lib/constants";

type BookingStatus = keyof typeof BOOKING_STATUSES;

interface Payment {
  id: string;
  bookingRef: string;
  amount: number;
  platformFee: number;
  hostPayout: number;
  status: BookingStatus;
  method: string;
  createdAt: string;
  renterName: string;
  hostName: string;
}

interface Stats {
  totalRevenue: number;
  totalFees: number;
  pendingPayouts: number;
  transactionCount: number;
}

export default function AdminPaymentsPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        setStats(data.stats || null);
      }
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) fetchPayments();
  }, [authorized, fetchPayments]);

  const filtered = payments.filter(
    (p) =>
      !search ||
      p.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      p.renterName.toLowerCase().includes(search.toLowerCase()) ||
      p.hostName.toLowerCase().includes(search.toLowerCase())
  );

  if (authorized === null) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
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
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            label="Platform Fees"
            value={formatCurrency(stats.totalFees)}
            icon={TrendingUp}
            color="blue"
          />
          <StatCard
            label="Pending Payouts"
            value={formatCurrency(stats.pendingPayouts)}
            icon={Clock}
            color="amber"
          />
          <StatCard
            label="Transactions"
            value={String(stats.transactionCount)}
            icon={CreditCard}
            color="purple"
          />
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-900">No payments found</p>
            <p className="text-sm text-gray-500">
              {search ? "Try adjusting your search." : "No payment transactions yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <th className="whitespace-nowrap px-4 py-3">Booking Ref</th>
                    <th className="whitespace-nowrap px-4 py-3">Date</th>
                    <th className="whitespace-nowrap px-4 py-3">Renter</th>
                    <th className="whitespace-nowrap px-4 py-3">Host</th>
                    <th className="whitespace-nowrap px-4 py-3">Amount</th>
                    <th className="whitespace-nowrap px-4 py-3">Platform Fee</th>
                    <th className="whitespace-nowrap px-4 py-3">Host Payout</th>
                    <th className="whitespace-nowrap px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-medium text-gray-900">
                        {payment.bookingRef}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {payment.renterName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {payment.hostName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-green-600">
                        {formatCurrency(payment.platformFee)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                        {formatCurrency(payment.hostPayout)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <Card className={`border ${colorMap[color]?.split(" ").pop() || "border-gray-200"}`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`rounded-lg p-2 ${colorMap[color]?.split(" ").slice(0, 2).join(" ") || "bg-gray-50 text-gray-600"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
