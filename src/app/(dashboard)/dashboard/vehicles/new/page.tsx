"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  MapPin,
  DollarSign,
  Calendar,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  AlertTriangle,
  Plus,
  X,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  VEHICLE_CATEGORIES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  VEHICLE_FEATURES,
} from "@/lib/constants";

const WIZARD_STEPS = [
  { id: 1, label: "Details", icon: Car },
  { id: 2, label: "Photos", icon: Upload },
  { id: 3, label: "Location", icon: MapPin },
  { id: 4, label: "Pricing", icon: DollarSign },
  { id: 5, label: "Availability", icon: Calendar },
  { id: 6, label: "Features", icon: Settings },
  { id: 7, label: "Review", icon: FileText },
];

interface VehicleForm {
  make: string;
  model: string;
  year: string;
  trim: string;
  vin: string;
  color: string;
  category: string;
  description: string;
  seats: string;
  doors: string;
  fuelType: string;
  transmission: string;
  drivetrain: string;
  mileage: string;
  electricRange: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
  dailyPrice: string;
  weeklyDiscount: string;
  monthlyDiscount: string;
  cleaningFee: string;
  deliveryFee: string;
  dailyMileageLimit: string;
  extraMileCharge: string;
  fuelPolicy: string;
  bookingMode: string;
  minTripDays: string;
  maxTripDays: string;
  deliveryEnabled: boolean;
  deliveryRadius: string;
  features: string[];
  guestRules: string;
}

const initialForm: VehicleForm = {
  make: "",
  model: "",
  year: new Date().getFullYear().toString(),
  trim: "",
  vin: "",
  color: "",
  category: "economy",
  description: "",
  seats: "5",
  doors: "4",
  fuelType: "GASOLINE",
  transmission: "AUTOMATIC",
  drivetrain: "",
  mileage: "",
  electricRange: "",
  city: "",
  state: "",
  zipCode: "",
  address: "",
  dailyPrice: "",
  weeklyDiscount: "",
  monthlyDiscount: "",
  cleaningFee: "",
  deliveryFee: "",
  dailyMileageLimit: "",
  extraMileCharge: "",
  fuelPolicy: "same-level",
  bookingMode: "REQUEST",
  minTripDays: "1",
  maxTripDays: "30",
  deliveryEnabled: false,
  deliveryRadius: "",
  features: [],
  guestRules: "",
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const POPULAR_MAKES = [
  "Acura","Audi","BMW","Buick","Cadillac","Chevrolet","Chrysler","Dodge","Ford",
  "GMC","Honda","Hyundai","Infiniti","Jaguar","Jeep","Kia","Land Rover","Lexus",
  "Lincoln","Mazda","Mercedes-Benz","Mini","Mitsubishi","Nissan","Porsche","RAM",
  "Rivian","Subaru","Tesla","Toyota","Volkswagen","Volvo",
];

export default function NewVehiclePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<VehicleForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateForm(updates: Partial<VehicleForm>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function toggleFeature(feature: string) {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!(form.make && form.model && form.year && form.category);
      case 3:
        return !!(form.city && form.state);
      case 4:
        return !!form.dailyPrice && parseFloat(form.dailyPrice) > 0;
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const body = {
        make: form.make,
        model: form.model,
        year: parseInt(form.year),
        trim: form.trim || undefined,
        vin: form.vin || undefined,
        color: form.color || undefined,
        category: form.category,
        description: form.description || undefined,
        seats: parseInt(form.seats),
        doors: parseInt(form.doors),
        fuelType: form.fuelType,
        transmission: form.transmission,
        drivetrain: form.drivetrain || undefined,
        mileage: form.mileage ? parseInt(form.mileage) : undefined,
        electricRange: form.electricRange
          ? parseInt(form.electricRange)
          : undefined,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode || undefined,
        address: form.address || undefined,
        dailyPrice: parseFloat(form.dailyPrice),
        weeklyDiscount: form.weeklyDiscount
          ? parseFloat(form.weeklyDiscount)
          : undefined,
        monthlyDiscount: form.monthlyDiscount
          ? parseFloat(form.monthlyDiscount)
          : undefined,
        cleaningFee: form.cleaningFee
          ? parseFloat(form.cleaningFee)
          : undefined,
        deliveryFee: form.deliveryFee
          ? parseFloat(form.deliveryFee)
          : undefined,
        dailyMileageLimit: form.dailyMileageLimit
          ? parseInt(form.dailyMileageLimit)
          : undefined,
        extraMileCharge: form.extraMileCharge
          ? parseFloat(form.extraMileCharge)
          : undefined,
        fuelPolicy: form.fuelPolicy,
        bookingMode: form.bookingMode,
        minTripDays: parseInt(form.minTripDays),
        maxTripDays: parseInt(form.maxTripDays),
        deliveryEnabled: form.deliveryEnabled,
        deliveryRadius: form.deliveryRadius
          ? parseInt(form.deliveryRadius)
          : undefined,
        features: form.features.length > 0 ? form.features : undefined,
      };

      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create listing");
      }

      router.push("/dashboard/vehicles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        List Your Vehicle
      </h1>

      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {WIZARD_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                step === s.id
                  ? "bg-neutral-100 text-neutral-900"
                  : step > s.id
                    ? "text-neutral-800 cursor-pointer hover:bg-neutral-50"
                    : "text-gray-400"
              )}
            >
              {step > s.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <s.icon className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 mx-0.5 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Vehicle Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make *
                </label>
                <select
                  value={form.make}
                  onChange={(e) => updateForm({ make: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none bg-white"
                >
                  <option value="">Select make</option>
                  {POPULAR_MAKES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => updateForm({ model: e.target.value })}
                  placeholder="e.g. Camry, Model 3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => updateForm({ year: e.target.value })}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trim
                </label>
                <input
                  type="text"
                  value={form.trim}
                  onChange={(e) => updateForm({ trim: e.target.value })}
                  placeholder="e.g. SE, Sport, Limited"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {VEHICLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => updateForm({ category: cat.value })}
                    className={cn(
                      "p-3 rounded-xl border-2 text-center text-sm transition-colors",
                      form.category === cat.value
                        ? "border-neutral-800 bg-neutral-50 text-neutral-900"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    )}
                  >
                    <div className="text-lg mb-1">{cat.icon}</div>
                    <div className="font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats
                </label>
                <input
                  type="number"
                  value={form.seats}
                  onChange={(e) => updateForm({ seats: e.target.value })}
                  min="1"
                  max="15"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  value={form.transmission}
                  onChange={(e) => updateForm({ transmission: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none bg-white"
                >
                  {TRANSMISSION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={form.fuelType}
                  onChange={(e) => updateForm({ fuelType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none bg-white"
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={form.color}
                  onChange={(e) => updateForm({ color: e.target.value })}
                  placeholder="e.g. White, Black, Silver"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Mileage
                </label>
                <input
                  type="number"
                  value={form.mileage}
                  onChange={(e) => updateForm({ mileage: e.target.value })}
                  placeholder="e.g. 25000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                rows={4}
                placeholder="Describe your vehicle, its condition, and what makes it special..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Vehicle Photos
            </h2>
            <p className="text-sm text-gray-500">
              Upload clear photos of your vehicle. Include front, back, sides,
              interior, and dashboard.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {["Front", "Back", "Left Side", "Right Side", "Interior", "Dashboard"].map(
                (label) => (
                  <div
                    key={label}
                    className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-gray-400">
              Photo upload requires file storage configuration. For now,
              listings will use placeholder images.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Location & Delivery
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateForm({ city: e.target.value })}
                  placeholder="e.g. Los Angeles"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  value={form.state}
                  onChange={(e) => updateForm({ state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none bg-white"
                >
                  <option value="">Select state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => updateForm({ zipCode: e.target.value })}
                  placeholder="e.g. 90001"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateForm({ address: e.target.value })}
                  placeholder="Pickup address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">
                    Enable delivery
                  </div>
                  <div className="text-sm text-gray-500">
                    Deliver the vehicle to your guest's location
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.deliveryEnabled}
                  onChange={(e) =>
                    updateForm({ deliveryEnabled: e.target.checked })
                  }
                  className="w-5 h-5 text-neutral-800 rounded focus:ring-neutral-500"
                />
              </label>
              {form.deliveryEnabled && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Radius (miles)
                    </label>
                    <input
                      type="number"
                      value={form.deliveryRadius}
                      onChange={(e) =>
                        updateForm({ deliveryRadius: e.target.value })
                      }
                      placeholder="e.g. 25"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Fee ($)
                    </label>
                    <input
                      type="number"
                      value={form.deliveryFee}
                      onChange={(e) =>
                        updateForm({ deliveryFee: e.target.value })
                      }
                      placeholder="e.g. 25"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Pricing & Policies
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Price ($) *
                </label>
                <input
                  type="number"
                  value={form.dailyPrice}
                  onChange={(e) => updateForm({ dailyPrice: e.target.value })}
                  placeholder="e.g. 65"
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cleaning Fee ($)
                </label>
                <input
                  type="number"
                  value={form.cleaningFee}
                  onChange={(e) => updateForm({ cleaningFee: e.target.value })}
                  placeholder="e.g. 25"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Discount (%)
                </label>
                <input
                  type="number"
                  value={form.weeklyDiscount}
                  onChange={(e) =>
                    updateForm({ weeklyDiscount: e.target.value })
                  }
                  placeholder="e.g. 15"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Discount (%)
                </label>
                <input
                  type="number"
                  value={form.monthlyDiscount}
                  onChange={(e) =>
                    updateForm({ monthlyDiscount: e.target.value })
                  }
                  placeholder="e.g. 30"
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-3">Mileage Policy</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Mileage Limit
                  </label>
                  <input
                    type="number"
                    value={form.dailyMileageLimit}
                    onChange={(e) =>
                      updateForm({ dailyMileageLimit: e.target.value })
                    }
                    placeholder="Leave blank for unlimited"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extra Mile Charge ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.extraMileCharge}
                    onChange={(e) =>
                      updateForm({ extraMileCharge: e.target.value })
                    }
                    placeholder="e.g. 0.45"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-3">Fuel Policy</h3>
              <select
                value={form.fuelPolicy}
                onChange={(e) => updateForm({ fuelPolicy: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none bg-white"
              >
                <option value="same-level">Return at same level</option>
                <option value="full-to-full">Full to full</option>
                <option value="prepaid">Prepaid fuel</option>
              </select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Availability & Booking
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Trip Duration (days)
                </label>
                <input
                  type="number"
                  value={form.minTripDays}
                  onChange={(e) => updateForm({ minTripDays: e.target.value })}
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Trip Duration (days)
                </label>
                <input
                  type="number"
                  value={form.maxTripDays}
                  onChange={(e) => updateForm({ maxTripDays: e.target.value })}
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Mode
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => updateForm({ bookingMode: "REQUEST" })}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-colors",
                    form.bookingMode === "REQUEST"
                      ? "border-neutral-800 bg-neutral-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="font-medium text-gray-900">
                    Request to Book
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Review and approve each booking request
                  </div>
                </button>
                <button
                  onClick={() => updateForm({ bookingMode: "INSTANT" })}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-colors",
                    form.bookingMode === "INSTANT"
                      ? "border-neutral-800 bg-neutral-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="font-medium text-gray-900">Instant Book</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Guests can book immediately without approval
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-neutral-800 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    Availability Calendar
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    After listing your vehicle, you can manage blackout dates and
                    availability from your vehicle dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Features & Rules
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Vehicle Features
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VEHICLE_FEATURES.map((feature) => (
                  <label
                    key={feature}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors text-sm",
                      form.features.includes(feature)
                        ? "border-neutral-800 bg-neutral-50 text-neutral-900"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={form.features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="w-4 h-4 text-neutral-800 rounded focus:ring-neutral-500"
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rules for Guests
              </label>
              <textarea
                value={form.guestRules}
                onChange={(e) => updateForm({ guestRules: e.target.value })}
                rows={3}
                placeholder="e.g. No smoking, no pets, return with same fuel level..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none resize-none"
              />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Review Your Listing
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Vehicle
                </h3>
                <p className="font-semibold text-gray-900">
                  {form.year} {form.make} {form.model}
                  {form.trim ? ` ${form.trim}` : ""}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {form.category} · {form.seats} seats ·{" "}
                  {form.transmission.toLowerCase()} ·{" "}
                  {form.fuelType.toLowerCase().replace("_", " ")}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Location
                </h3>
                <p className="font-semibold text-gray-900">
                  {form.city}, {form.state} {form.zipCode}
                </p>
                {form.deliveryEnabled && (
                  <p className="text-sm text-neutral-800">
                    Delivery enabled
                    {form.deliveryRadius
                      ? ` (${form.deliveryRadius} mile radius)`
                      : ""}
                  </p>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Pricing
                </h3>
                <p className="font-semibold text-gray-900">
                  ${form.dailyPrice}/day
                </p>
                <div className="text-sm text-gray-600">
                  {form.weeklyDiscount && (
                    <span>{form.weeklyDiscount}% weekly discount · </span>
                  )}
                  {form.monthlyDiscount && (
                    <span>{form.monthlyDiscount}% monthly discount · </span>
                  )}
                  {form.bookingMode === "INSTANT"
                    ? "Instant Book"
                    : "Request to Book"}
                </div>
              </div>

              {form.features.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Features ({form.features.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((f) => (
                      <span
                        key={f}
                        className="bg-neutral-100 text-neutral-900 text-xs px-2 py-1 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl">
              <div className="flex gap-2 text-sm text-neutral-700">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Your listing will be submitted for review. Our team typically
                  approves listings within 24 hours. You'll be notified once your
                  vehicle is live.
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < WIZARD_STEPS.length ? (
            <button
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white transition-colors",
                canProceed()
                  ? "bg-neutral-800 hover:bg-neutral-900"
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-colors",
                submitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-neutral-800 hover:bg-neutral-900"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit for Review
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
