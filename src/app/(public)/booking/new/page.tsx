"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  MapPin,
  Calendar,
  Shield,
  CreditCard,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Star,
  Clock,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { INSURANCE_TIERS } from "@/lib/constants";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  slug: string;
  category: string;
  city?: string;
  state?: string;
  dailyPrice: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  cleaningFee?: number;
  deliveryFee?: number;
  deliveryEnabled: boolean;
  bookingMode: string;
  minTripDays: number;
  maxTripDays: number;
  images: { url: string; isPrimary: boolean }[];
  features: { name: string }[];
  addOns: { id: string; name: string; description?: string; pricePerDay: number }[];
  host: {
    id: string;
    name?: string;
    firstName?: string;
    avatarUrl?: string;
    hostProfile?: { avgRating?: number; totalTrips: number; superHost: boolean };
  };
}

interface PriceEstimate {
  dailyRate: number;
  numDays: number;
  subtotal: number;
  weeklyDiscount: number;
  cleaningFee: number;
  deliveryFee: number;
  addOnTotal: number;
  insuranceFee: number;
  serviceFee: number;
  taxAmount: number;
  totalPrice: number;
}

const STEPS = [
  { id: 1, label: "Trip Details", icon: Calendar },
  { id: 2, label: "Protection", icon: Shield },
  { id: 3, label: "Review & Pay", icon: CreditCard },
];

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: typeof STEPS;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              currentStep === step.id
                ? "bg-green-100 text-green-700"
                : currentStep > step.id
                  ? "text-green-600"
                  : "text-gray-400"
            )}
          >
            {currentStep > step.id ? (
              <Check className="w-4 h-4" />
            ) : (
              <step.icon className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vehicleId = searchParams.get("vehicleId");
  const initialPickup = searchParams.get("pickupDate") ?? "";
  const initialReturn = searchParams.get("returnDate") ?? "";

  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [pickupDate, setPickupDate] = useState(initialPickup);
  const [returnDate, setReturnDate] = useState(initialReturn);
  const [pickupType, setPickupType] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [insuranceTier, setInsuranceTier] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!vehicleId) {
      setError("No vehicle selected");
      setLoading(false);
      return;
    }
    fetch(`/api/vehicles/${vehicleId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Vehicle not found");
        return r.json();
      })
      .then(setVehicle)
      .catch(() => setError("Vehicle not found"))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  const numDays =
    pickupDate && returnDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(returnDate).getTime() -
              new Date(pickupDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const calculateEstimate = useCallback((): PriceEstimate | null => {
    if (!vehicle || numDays === 0) return null;

    let subtotal = vehicle.dailyPrice * numDays;
    let weeklyDiscount = 0;

    if (numDays >= 7 && vehicle.weeklyDiscount) {
      weeklyDiscount = subtotal * (vehicle.weeklyDiscount / 100);
      subtotal -= weeklyDiscount;
    }

    const cleaningFee = vehicle.cleaningFee ?? 0;
    const deliveryFee =
      pickupType === "delivery" ? (vehicle.deliveryFee ?? 0) : 0;

    const selectedAddOnItems = vehicle.addOns.filter((a) =>
      selectedAddOns.includes(a.id)
    );
    const addOnTotal = selectedAddOnItems.reduce(
      (sum, a) => sum + a.pricePerDay * numDays,
      0
    );

    const insurancePremiums: Record<string, number> = {
      basic: 12,
      standard: 22,
      premium: 35,
      premium_plus: 49,
    };
    const insuranceFee = insuranceTier
      ? (insurancePremiums[insuranceTier] ?? 0) * numDays
      : 0;

    const preTax =
      subtotal + cleaningFee + deliveryFee + addOnTotal + insuranceFee;
    const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
    const taxAmount = Math.round((preTax + serviceFee) * 0.085 * 100) / 100;
    const totalPrice =
      Math.round((preTax + serviceFee + taxAmount) * 100) / 100;

    return {
      dailyRate: vehicle.dailyPrice,
      numDays,
      subtotal: Math.round(subtotal * 100) / 100,
      weeklyDiscount: Math.round(weeklyDiscount * 100) / 100,
      cleaningFee,
      deliveryFee,
      addOnTotal: Math.round(addOnTotal * 100) / 100,
      insuranceFee: Math.round(insuranceFee * 100) / 100,
      serviceFee,
      taxAmount,
      totalPrice,
    };
  }, [vehicle, numDays, pickupType, selectedAddOns, insuranceTier]);

  const estimate = calculateEstimate();

  async function handleSubmit() {
    if (!vehicle || !pickupDate || !returnDate || !agreedToTerms) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          pickupDate: new Date(pickupDate).toISOString(),
          returnDate: new Date(returnDate).toISOString(),
          pickupType,
          pickupAddress: pickupType === "delivery" ? deliveryAddress : undefined,
          addOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
          insuranceTier: insuranceTier || undefined,
          promoCode: promoCode || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Booking failed");
      }

      const booking = await res.json();
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container-page py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="container-page py-16 text-center">
        <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          Browse vehicles
        </Link>
      </div>
    );
  }

  if (!vehicle) return null;

  const hostName = vehicle.host.firstName ?? vehicle.host.name ?? "Host";

  return (
    <div className="container-page py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/vehicles/${vehicle.slug}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to listing
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Book {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>

        <StepIndicator currentStep={step} steps={STEPS} />

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Trip dates
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup date
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        min={today}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Return date
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        min={pickupDate || today}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Pickup method
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setPickupType("pickup")}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-colors",
                        pickupType === "pickup"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <MapPin className="w-5 h-5 text-green-600 mb-2" />
                      <div className="font-medium text-gray-900">Pick up at location</div>
                      <div className="text-sm text-gray-500">
                        {vehicle.city}, {vehicle.state}
                      </div>
                    </button>
                    {vehicle.deliveryEnabled && (
                      <button
                        onClick={() => setPickupType("delivery")}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-colors",
                          pickupType === "delivery"
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <Car className="w-5 h-5 text-green-600 mb-2" />
                        <div className="font-medium text-gray-900">Deliver to me</div>
                        <div className="text-sm text-gray-500">
                          {vehicle.deliveryFee
                            ? `${formatCurrency(vehicle.deliveryFee)} fee`
                            : "Free delivery"}
                        </div>
                      </button>
                    )}
                  </div>
                  {pickupType === "delivery" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    </div>
                  )}
                </div>

                {vehicle.addOns.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Add-ons
                    </h2>
                    <div className="space-y-3">
                      {vehicle.addOns.map((addon) => (
                        <label
                          key={addon.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                            selectedAddOns.includes(addon.id)
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedAddOns.includes(addon.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAddOns([...selectedAddOns, addon.id]);
                                } else {
                                  setSelectedAddOns(
                                    selectedAddOns.filter((id) => id !== addon.id)
                                  );
                                }
                              }}
                              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {addon.name}
                              </div>
                              {addon.description && (
                                <div className="text-sm text-gray-500">
                                  {addon.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {formatCurrency(addon.pricePerDay)}/day
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!pickupDate || !returnDate}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-colors",
                      pickupDate && returnDate
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    )}
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Choose your protection
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Select a protection plan for peace of mind during your trip.
                  </p>

                  <div className="space-y-3">
                    <label
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                        !insuranceTier
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="insurance"
                          checked={!insuranceTier}
                          onChange={() => setInsuranceTier("")}
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            No protection
                          </div>
                          <div className="text-sm text-gray-500">
                            I'll use my own insurance
                          </div>
                        </div>
                      </div>
                      <span className="font-medium text-gray-700">Free</span>
                    </label>

                    {INSURANCE_TIERS.map((tier) => {
                      const premiums: Record<string, number> = {
                        basic: 12,
                        standard: 22,
                        premium: 35,
                        premium_plus: 49,
                      };
                      const premium = premiums[tier.id] ?? 0;
                      return (
                        <label
                          key={tier.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                            insuranceTier === tier.id
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="insurance"
                              checked={insuranceTier === tier.id}
                              onChange={() => setInsuranceTier(tier.id)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {tier.name}
                                </span>
                                {tier.id === "premium" && (
                                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {tier.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {formatCurrency(tier.deductible)} deductible
                              </div>
                            </div>
                          </div>
                          <span className="font-medium text-gray-700">
                            {formatCurrency(premium)}/day
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <div className="flex gap-2 text-xs text-amber-700">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        Protection plans are provided through our insurance
                        partners. Coverage is only active when confirmed with a
                        valid policy. Terms and eligibility apply.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Trip summary
                  </h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle</span>
                      <span className="font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup</span>
                      <span>{pickupDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Return</span>
                      <span>{returnDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup method</span>
                      <span className="capitalize">{pickupType}</span>
                    </div>
                    {insuranceTier && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protection</span>
                        <span>
                          {INSURANCE_TIERS.find((t) => t.id === insuranceTier)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Promo code
                  </h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                    />
                    <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Agreements
                  </h2>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-green-600 hover:underline"
                        target="_blank"
                      >
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link
                        href="/privacy"
                        className="text-green-600 hover:underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link
                        href="/cancellation-policy"
                        className="text-green-600 hover:underline"
                        target="_blank"
                      >
                        Cancellation Policy
                      </Link>
                      . I understand that protection coverage is subject to
                      provider terms and is only active upon confirmed policy
                      issuance.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm flex gap-2">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!agreedToTerms || submitting}
                    className={cn(
                      "flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-colors",
                      agreedToTerms && !submitting
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-300 cursor-not-allowed"
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : vehicle.bookingMode === "INSTANT" ? (
                      "Confirm & Pay"
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
              <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="w-20 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="w-8 h-8 text-white/60" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {vehicle.host.hostProfile?.avgRating && (
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {vehicle.host.hostProfile.avgRating.toFixed(1)}
                      </span>
                    )}
                    <span>
                      {vehicle.city}, {vehicle.state}
                    </span>
                  </div>
                </div>
              </div>

              {estimate && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {formatCurrency(estimate.dailyRate)} x {estimate.numDays}{" "}
                      day{estimate.numDays > 1 ? "s" : ""}
                    </span>
                    <span>
                      {formatCurrency(estimate.dailyRate * estimate.numDays)}
                    </span>
                  </div>
                  {estimate.weeklyDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Weekly discount</span>
                      <span>-{formatCurrency(estimate.weeklyDiscount)}</span>
                    </div>
                  )}
                  {estimate.cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cleaning fee</span>
                      <span>{formatCurrency(estimate.cleaningFee)}</span>
                    </div>
                  )}
                  {estimate.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery fee</span>
                      <span>{formatCurrency(estimate.deliveryFee)}</span>
                    </div>
                  )}
                  {estimate.addOnTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Add-ons</span>
                      <span>{formatCurrency(estimate.addOnTotal)}</span>
                    </div>
                  )}
                  {estimate.insuranceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protection</span>
                      <span>{formatCurrency(estimate.insuranceFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>{formatCurrency(estimate.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>{formatCurrency(estimate.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatCurrency(estimate.totalPrice)}</span>
                  </div>
                </div>
              )}

              {!estimate && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Select dates to see price
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense>
      <BookingContent />
    </Suspense>
  );
}
