"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Trash2,
  DollarSign,
  CalendarOff,
  Tag,
  Power,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";

interface AvailabilityBlock {
  id: string;
  startDate: string;
  endDate: string;
  isBlocked: boolean;
  reason: string | null;
}

interface PricingRule {
  id: string;
  name: string;
  type: string;
  value: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

interface VehicleCalendarProps {
  vehicleId: string;
  dailyPrice: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(date: Date, start: Date, end: Date): boolean {
  const d = startOfDay(date);
  return d >= startOfDay(start) && d <= startOfDay(end);
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${fmt(s)} - ${fmt(e)}`;
}

function getEffectivePrice(
  date: Date,
  dailyPrice: number,
  rules: PricingRule[]
): number | null {
  const d = startOfDay(date);
  const rule = rules.find((r) => {
    if (!r.isActive || !r.startDate || !r.endDate) return false;
    return d >= startOfDay(new Date(r.startDate)) && d <= startOfDay(new Date(r.endDate));
  });
  if (!rule) return null;
  switch (rule.type) {
    case "percentage_discount":
      return dailyPrice * (1 - rule.value / 100);
    case "percentage_increase":
      return dailyPrice * (1 + rule.value / 100);
    case "fixed_amount":
      return rule.value;
    default:
      return null;
  }
}

export function VehicleCalendar({ vehicleId, dailyPrice }: VehicleCalendarProps) {
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [selStart, setSelStart] = useState<Date | null>(null);
  const [selEnd, setSelEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [priceName, setPriceName] = useState("");
  const [priceType, setPriceType] = useState("percentage_discount");
  const [priceValue, setPriceValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [bRes, pRes] = await Promise.all([
        fetch(`/api/admin/vehicles/${vehicleId}/availability`),
        fetch(`/api/admin/vehicles/${vehicleId}/pricing`),
      ]);
      const bData = await bRes.json();
      const pData = await pRes.json();
      setBlocks(Array.isArray(bData) ? bData : []);
      setRules(Array.isArray(pData) ? pData : []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const handleDayClick = (date: Date) => {
    if (date < today) return;
    if (!selStart || selEnd) {
      setSelStart(date);
      setSelEnd(null);
    } else {
      if (date < selStart) {
        setSelEnd(selStart);
        setSelStart(date);
      } else {
        setSelEnd(date);
      }
    }
  };

  const clearSelection = () => {
    setSelStart(null);
    setSelEnd(null);
    setHoveredDate(null);
  };

  const getSelectionRange = (): [Date, Date] | null => {
    if (selStart && selEnd) return [selStart, selEnd];
    if (selStart && hoveredDate) {
      return hoveredDate < selStart ? [hoveredDate, selStart] : [selStart, hoveredDate];
    }
    return null;
  };

  const isBlocked = (date: Date): boolean => {
    const d = startOfDay(date);
    return blocks.some((b) => {
      const bs = startOfDay(new Date(b.startDate));
      const be = startOfDay(new Date(b.endDate));
      return d >= bs && d <= be;
    });
  };

  const handleBlockDates = async () => {
    if (!selStart || !selEnd) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: selStart.toISOString(),
          endDate: selEnd.toISOString(),
          isBlocked: true,
          reason: blockReason || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to block dates");
        return;
      }
      await fetchData();
      clearSelection();
      setBlockReason("");
      setShowBlockDialog(false);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBlock = async (blockId: string) => {
    try {
      await fetch(
        `/api/admin/vehicles/${vehicleId}/availability?blockId=${blockId}`,
        { method: "DELETE" }
      );
      await fetchData();
    } catch {
      // silently fail
    }
  };

  const handleCreatePriceRule = async () => {
    if (!selStart || !selEnd) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: priceName,
          type: priceType,
          value: Number(priceValue),
          startDate: selStart.toISOString(),
          endDate: selEnd.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create pricing rule");
        return;
      }
      await fetchData();
      clearSelection();
      setPriceName("");
      setPriceType("percentage_discount");
      setPriceValue("");
      setShowPriceDialog(false);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      await fetch(
        `/api/admin/vehicles/${vehicleId}/pricing?ruleId=${ruleId}`,
        { method: "PATCH" }
      );
      await fetchData();
    } catch {
      // silently fail
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await fetch(
        `/api/admin/vehicles/${vehicleId}/pricing?ruleId=${ruleId}`,
        { method: "DELETE" }
      );
      await fetchData();
    } catch {
      // silently fail
    }
  };

  const previewPrice = (): string | null => {
    const v = Number(priceValue);
    if (!v || v <= 0) return null;
    switch (priceType) {
      case "percentage_discount":
        return formatCurrency(dailyPrice * (1 - v / 100));
      case "percentage_increase":
        return formatCurrency(dailyPrice * (1 + v / 100));
      case "fixed_amount":
        return formatCurrency(v);
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const selRange = getSelectionRange();

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Availability Calendar</CardTitle>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-red-200 border border-red-300" />
                Blocked
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-blue-100 border border-blue-300" />
                Custom Price
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-neutral-200 border border-neutral-400" />
                Selected
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month navigation */}
          <div className="mb-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-sm font-semibold text-gray-900">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-xs font-medium text-gray-500"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: totalCells }, (_, i) => {
              const dayNum = i - firstDayOfWeek + 1;
              const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;

              if (!isCurrentMonth) {
                return <div key={i} className="h-16" />;
              }

              const date = new Date(currentYear, currentMonth, dayNum);
              const isPast = date < today;
              const isToday = isSameDay(date, today);
              const blocked = isBlocked(date);
              const effectivePrice = getEffectivePrice(date, dailyPrice, rules);
              const inSelection =
                selRange && isInRange(date, selRange[0], selRange[1]);
              const isSelStart = selStart && isSameDay(date, selStart);
              const isSelEnd = selEnd && isSameDay(date, selEnd);

              let cellClass =
                "relative h-16 rounded-lg border text-left transition-all p-1 ";

              if (isPast) {
                cellClass += "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed";
              } else if (blocked) {
                cellClass +=
                  "bg-red-50 border-red-200 text-red-700 cursor-pointer hover:bg-red-100";
              } else if (inSelection) {
                cellClass +=
                  "bg-neutral-100 border-neutral-400 ring-1 ring-neutral-500 text-gray-900 cursor-pointer";
              } else if (effectivePrice !== null) {
                cellClass +=
                  "bg-blue-50 border-blue-200 text-gray-900 cursor-pointer hover:bg-blue-100";
              } else {
                cellClass +=
                  "bg-white border-gray-200 text-gray-900 cursor-pointer hover:bg-gray-50";
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPast}
                  className={cellClass}
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => {
                    if (selStart && !selEnd) setHoveredDate(date);
                  }}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <span
                    className={`text-xs font-medium ${
                      isToday
                        ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-white"
                        : ""
                    } ${isSelStart || isSelEnd ? "font-bold" : ""}`}
                  >
                    {dayNum}
                  </span>
                  {blocked && (
                    <Lock className="absolute bottom-1 right-1 h-3 w-3 text-red-400" />
                  )}
                  {!blocked && effectivePrice !== null && (
                    <span className="absolute bottom-0.5 left-1 text-[10px] font-medium text-blue-600">
                      {formatCurrency(effectivePrice)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selection action bar */}
          {selStart && selEnd && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <span className="text-sm text-gray-600">
                Selected:{" "}
                <strong>
                  {selStart.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {selEnd.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setError("");
                    setShowBlockDialog(true);
                  }}
                >
                  <CalendarOff className="mr-1.5 h-3.5 w-3.5" />
                  Block Dates
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setError("");
                    setShowPriceDialog(true);
                  }}
                >
                  <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                  Set Price
                </Button>
                <Button size="sm" variant="ghost" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>
          )}

          {selStart && !selEnd && (
            <p className="mt-3 text-sm text-gray-500">
              Click another date to complete the range selection.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Blocked Dates List */}
      {blocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarOff className="h-5 w-5" />
              Blocked Dates ({blocks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateRange(block.startDate, block.endDate)}
                    </p>
                    {block.reason && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {block.reason}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleRemoveBlock(block.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Rules List */}
      {rules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="h-5 w-5" />
              Pricing Rules ({rules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {rules.map((rule) => {
                const typeLabel =
                  rule.type === "percentage_discount"
                    ? "Discount"
                    : rule.type === "percentage_increase"
                      ? "Increase"
                      : "Fixed";
                const typeBadge =
                  rule.type === "percentage_discount"
                    ? "success"
                    : rule.type === "percentage_increase"
                      ? "warning"
                      : "info";
                const valueLabel =
                  rule.type === "fixed_amount"
                    ? formatCurrency(rule.value)
                    : `${rule.value}%`;

                return (
                  <div
                    key={rule.id}
                    className={`flex items-center justify-between py-3 first:pt-0 last:pb-0 ${
                      !rule.isActive ? "opacity-50" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {rule.name}
                        </p>
                        <Badge variant={typeBadge as "success" | "warning" | "info"}>
                          {typeLabel} {valueLabel}
                        </Badge>
                      </div>
                      {rule.startDate && rule.endDate && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDateRange(rule.startDate, rule.endDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={
                          rule.isActive
                            ? "text-green-600 hover:text-gray-600"
                            : "text-gray-400 hover:text-green-600"
                        }
                        onClick={() => handleToggleRule(rule.id)}
                        title={rule.isActive ? "Disable" : "Enable"}
                      >
                        <Power className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Block Dates Dialog */}
      <Dialog open={showBlockDialog} onClose={() => setShowBlockDialog(false)}>
        <DialogHeader onClose={() => setShowBlockDialog(false)}>
          <DialogTitle>Block Dates</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {selStart && selEnd && (
            <p className="mb-4 text-sm text-gray-600">
              Blocking:{" "}
              <strong>
                {selStart.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                -{" "}
                {selEnd.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </strong>
            </p>
          )}
          <Textarea
            label="Reason (optional)"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="e.g., Vehicle in maintenance, Owner personal use"
            rows={2}
          />
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowBlockDialog(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBlockDates}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Block Dates
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Set Price Dialog */}
      <Dialog open={showPriceDialog} onClose={() => setShowPriceDialog(false)}>
        <DialogHeader onClose={() => setShowPriceDialog(false)}>
          <DialogTitle>Set Custom Price</DialogTitle>
        </DialogHeader>
        <DialogContent className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {selStart && selEnd && (
            <p className="text-sm text-gray-600">
              Dates:{" "}
              <strong>
                {selStart.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                -{" "}
                {selEnd.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </strong>
            </p>
          )}
          <Input
            label="Rule Name"
            value={priceName}
            onChange={(e) => setPriceName(e.target.value)}
            placeholder="e.g., Summer Peak Season"
          />
          <Select
            label="Adjustment Type"
            value={priceType}
            onChange={(e) => setPriceType(e.target.value)}
            options={[
              { value: "percentage_discount", label: "Percentage Discount" },
              { value: "percentage_increase", label: "Percentage Increase" },
              { value: "fixed_amount", label: "Fixed Amount ($/day)" },
            ]}
          />
          <Input
            label={
              priceType === "fixed_amount"
                ? "Price ($/day)"
                : priceType === "percentage_discount"
                  ? "Discount (%)"
                  : "Increase (%)"
            }
            type="number"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            placeholder={priceType === "fixed_amount" ? "55.00" : "15"}
            min={0}
            step={priceType === "fixed_amount" ? "0.01" : "1"}
          />
          {previewPrice() && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              <span className="text-gray-600">Base: </span>
              <span className="text-gray-900">{formatCurrency(dailyPrice)}/day</span>
              <span className="mx-2 text-gray-400">&rarr;</span>
              <span className="font-semibold text-blue-700">
                {previewPrice()}/day
              </span>
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowPriceDialog(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePriceRule}
            disabled={saving || !priceName || !priceValue}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Apply Price Rule
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
