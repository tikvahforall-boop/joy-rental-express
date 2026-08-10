"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock, Car } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  vehicleName: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
}

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "processing";
  reference: string;
}

interface MonthlyEarning {
  month: string;
  amount: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", vehicleName: "2023 Toyota Camry", date: "2026-08-07", amount: 245.0, status: "completed" },
  { id: "t2", vehicleName: "2022 Honda CR-V", date: "2026-08-05", amount: 189.0, status: "completed" },
  { id: "t3", vehicleName: "2024 Tesla Model 3", date: "2026-08-03", amount: 312.0, status: "pending" },
  { id: "t4", vehicleName: "2023 Toyota Camry", date: "2026-07-28", amount: 490.0, status: "completed" },
  { id: "t5", vehicleName: "2022 Honda CR-V", date: "2026-07-22", amount: 378.0, status: "completed" },
  { id: "t6", vehicleName: "2024 Tesla Model 3", date: "2026-07-15", amount: 156.0, status: "cancelled" },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: "p1", date: "2026-08-01", amount: 1245.0, status: "paid", reference: "PAY-2026-0801" },
  { id: "p2", date: "2026-07-15", amount: 987.5, status: "paid", reference: "PAY-2026-0715" },
  { id: "p3", date: "2026-07-01", amount: 1102.0, status: "paid", reference: "PAY-2026-0701" },
  { id: "p4", date: "2026-08-15", amount: 746.0, status: "processing", reference: "PAY-2026-0815" },
];

const MOCK_MONTHLY: MonthlyEarning[] = [
  { month: "Mar", amount: 1820 },
  { month: "Apr", amount: 2340 },
  { month: "May", amount: 1950 },
  { month: "Jun", amount: 2780 },
  { month: "Jul", amount: 3100 },
  { month: "Aug", amount: 1246 },
];

const TRANSACTION_BADGE_MAP: Record<string, "success" | "warning" | "error"> = {
  completed: "success",
  pending: "warning",
  cancelled: "error",
};

const PAYOUT_BADGE_MAP: Record<string, "success" | "warning" | "info"> = {
  paid: "success",
  pending: "warning",
  processing: "info",
};

export default function EarningsPage() {
  const [loading, setLoading] = useState(true);
  const [totalEarnings] = useState(14236.5);
  const [monthlyEarnings] = useState(1246.0);
  const [pendingPayouts] = useState(746.0);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [payouts] = useState<Payout[]>(MOCK_PAYOUTS);
  const [monthlyData] = useState<MonthlyEarning[]>(MOCK_MONTHLY);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const maxMonthlyAmount = Math.max(...monthlyData.map((m) => m.amount));

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-5 w-40" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-5 w-40" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-t-4 border-t-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(totalEarnings)}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(monthlyEarnings)}
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Payouts</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(pendingPayouts)}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 sm:gap-6" style={{ height: 200 }}>
            {monthlyData.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  {formatCurrency(item.amount)}
                </span>
                <div
                  className="w-full rounded-t-md bg-green-500 transition-all"
                  style={{
                    height: `${(item.amount / maxMonthlyAmount) * 140}px`,
                    minHeight: 8,
                  }}
                />
                <span className="text-xs font-medium text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gray-100 p-2">
                    <Car className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.vehicleName}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(tx.amount)}
                  </span>
                  <Badge variant={TRANSACTION_BADGE_MAP[tx.status]}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left font-medium text-gray-500">Date</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Amount</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Status</th>
                  <th className="pb-3 text-left font-medium text-gray-500">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td className="py-3 text-gray-900">{formatDate(payout.date)}</td>
                    <td className="py-3 font-medium text-gray-900">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="py-3">
                      <Badge variant={PAYOUT_BADGE_MAP[payout.status]}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 font-mono text-xs text-gray-500">{payout.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
