"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Search,
  Loader2,
  MapPin,
  DollarSign,
  Settings,
  Zap,
  ImageIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";

interface VehicleData {
  id?: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  color?: string;
  category: string;
  description?: string;
  seats: number;
  doors: number;
  fuelType: string;
  transmission: string;
  drivetrain?: string;
  mileage?: number;
  city: string;
  state: string;
  zipCode?: string;
  address?: string;
  dailyPrice: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  cleaningFee?: number;
  deliveryFee?: number;
  dailyMileageLimit?: number;
  extraMileCharge?: number;
  bookingMode: string;
  minTripDays: number;
  maxTripDays: number;
  deliveryEnabled: boolean;
  deliveryRadius?: number;
  instantBookEligible?: boolean;
  features?: string[];
  licensePlate?: string;
  images?: { id: string; url: string; caption: string | null; isPrimary: boolean; position: number }[];
}

const EMPTY_VEHICLE: VehicleData = {
  vin: "",
  make: "",
  model: "",
  year: new Date().getFullYear(),
  trim: "",
  color: "",
  category: "economy",
  description: "",
  seats: 5,
  doors: 4,
  fuelType: "GASOLINE",
  transmission: "AUTOMATIC",
  drivetrain: "",
  mileage: undefined,
  city: "",
  state: "CO",
  zipCode: "",
  address: "",
  dailyPrice: 0,
  weeklyDiscount: undefined,
  monthlyDiscount: undefined,
  cleaningFee: undefined,
  deliveryFee: undefined,
  dailyMileageLimit: undefined,
  extraMileCharge: undefined,
  bookingMode: "INSTANT",
  minTripDays: 1,
  maxTripDays: 30,
  deliveryEnabled: false,
  deliveryRadius: undefined,
  instantBookEligible: true,
  features: [],
  licensePlate: "",
};

const CATEGORIES = [
  { value: "economy", label: "Economy" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
  { value: "electric", label: "Electric" },
  { value: "sports", label: "Sports" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Truck" },
  { value: "family", label: "Family" },
];

const FUEL_TYPES = [
  { value: "GASOLINE", label: "Gasoline" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "PLUG_IN_HYBRID", label: "Plug-in Hybrid" },
];

const TRANSMISSIONS = [
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "MANUAL", label: "Manual" },
];

const DRIVETRAINS = [
  { value: "", label: "Not specified" },
  { value: "FWD", label: "Front-Wheel Drive" },
  { value: "RWD", label: "Rear-Wheel Drive" },
  { value: "AWD", label: "All-Wheel Drive" },
  { value: "FOUR_WD", label: "4-Wheel Drive" },
];

const STATES = [
  { value: "CO", label: "Colorado" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

const COMMON_FEATURES = [
  "Bluetooth",
  "Backup Camera",
  "Apple CarPlay",
  "Android Auto",
  "USB Charging",
  "GPS Navigation",
  "Heated Seats",
  "Leather Seats",
  "Sunroof",
  "Keyless Entry",
  "Cruise Control",
  "Blind Spot Monitor",
  "Lane Assist",
  "Parking Sensors",
  "Third Row Seating",
  "Roof Rack",
  "Tow Hitch",
  "All-Weather Mats",
  "Ski Rack",
  "Bike Rack",
  "Child Seat",
  "Toll Pass",
  "Satellite Radio",
  "Premium Sound",
];

interface VehicleFormProps {
  initialData?: VehicleData;
  mode: "create" | "edit";
}

export function VehicleForm({ initialData, mode }: VehicleFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<VehicleData>(initialData || EMPTY_VEHICLE);
  const [images, setImages] = useState(initialData?.images || []);
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState("");
  const [vinSuccess, setVinSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof VehicleData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => {
      const features = prev.features || [];
      return {
        ...prev,
        features: features.includes(feature)
          ? features.filter((f) => f !== feature)
          : [...features, feature],
      };
    });
  };

  const decodeVin = async () => {
    const vin = (form.vin || "").trim().toUpperCase();
    if (vin.length !== 17) {
      setVinError("VIN must be exactly 17 characters");
      return;
    }

    setVinLoading(true);
    setVinError("");
    setVinSuccess("");

    try {
      const res = await fetch(`/api/vin?vin=${vin}`);
      const data = await res.json();

      if (!res.ok) {
        setVinError(data.error || "Failed to decode VIN");
        return;
      }

      setForm((prev) => ({
        ...prev,
        vin,
        make: data.make || prev.make,
        model: data.model || prev.model,
        year: data.year || prev.year,
        trim: data.trim || prev.trim,
        fuelType: data.fuelType || prev.fuelType,
        transmission: data.transmission || prev.transmission,
        drivetrain: data.drivetrain || prev.drivetrain || "",
        doors: data.doors || prev.doors,
        seats: data.seats || prev.seats,
        category: data.category || prev.category,
      }));

      const filled = [
        data.make && "Make",
        data.model && "Model",
        data.year && "Year",
        data.trim && "Trim",
        data.fuelType && "Fuel Type",
        data.transmission && "Transmission",
      ].filter(Boolean);

      setVinSuccess(`Auto-filled: ${filled.join(", ")}`);
    } catch {
      setVinError("Network error decoding VIN");
    } finally {
      setVinLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        year: Number(form.year),
        seats: Number(form.seats),
        doors: Number(form.doors),
        dailyPrice: Number(form.dailyPrice),
        mileage: form.mileage ? Number(form.mileage) : undefined,
        weeklyDiscount: form.weeklyDiscount ? Number(form.weeklyDiscount) : undefined,
        monthlyDiscount: form.monthlyDiscount ? Number(form.monthlyDiscount) : undefined,
        cleaningFee: form.cleaningFee ? Number(form.cleaningFee) : undefined,
        deliveryFee: form.deliveryFee ? Number(form.deliveryFee) : undefined,
        dailyMileageLimit: form.dailyMileageLimit ? Number(form.dailyMileageLimit) : undefined,
        extraMileCharge: form.extraMileCharge ? Number(form.extraMileCharge) : undefined,
        minTripDays: Number(form.minTripDays),
        maxTripDays: Number(form.maxTripDays),
        deliveryRadius: form.deliveryRadius ? Number(form.deliveryRadius) : undefined,
        drivetrain: form.drivetrain || undefined,
      };

      const url =
        mode === "edit"
          ? `/api/admin/vehicles/${form.id}`
          : "/api/admin/vehicles";

      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save vehicle");
        return;
      }

      if (mode === "create" && data.id) {
        router.push(`/admin/vehicles/${data.id}/edit`);
      } else {
        router.push("/admin/vehicles");
      }
      router.refresh();
    } catch {
      setError("Network error saving vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* VIN Decoder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            VIN Decoder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="Vehicle Identification Number (VIN)"
                value={form.vin || ""}
                onChange={(e) => updateField("vin", e.target.value.toUpperCase())}
                placeholder="Enter 17-character VIN"
                maxLength={17}
                error={vinError}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={decodeVin}
                disabled={vinLoading || (form.vin || "").length !== 17}
              >
                {vinLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Decode
              </Button>
            </div>
          </div>
          {vinSuccess && (
            <p className="text-sm text-green-600">{vinSuccess}</p>
          )}
          <p className="text-xs text-gray-400">
            Enter the VIN to auto-fill make, model, year, trim, fuel type, and more using NHTSA data.
          </p>
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Car className="h-5 w-5" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Make *"
              value={form.make}
              onChange={(e) => updateField("make", e.target.value)}
              placeholder="e.g. Toyota"
              required
            />
            <Input
              label="Model *"
              value={form.model}
              onChange={(e) => updateField("model", e.target.value)}
              placeholder="e.g. Camry"
              required
            />
            <Input
              label="Year *"
              type="number"
              value={form.year}
              onChange={(e) => updateField("year", e.target.value)}
              min={1990}
              max={new Date().getFullYear() + 1}
              required
            />
            <Input
              label="Trim"
              value={form.trim || ""}
              onChange={(e) => updateField("trim", e.target.value)}
              placeholder="e.g. SE, XLE, Limited"
            />
            <Input
              label="Color"
              value={form.color || ""}
              onChange={(e) => updateField("color", e.target.value)}
              placeholder="e.g. Silver"
            />
            <Select
              label="Category *"
              options={CATEGORIES}
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
            <Select
              label="Fuel Type"
              options={FUEL_TYPES}
              value={form.fuelType}
              onChange={(e) => updateField("fuelType", e.target.value)}
            />
            <Select
              label="Transmission"
              options={TRANSMISSIONS}
              value={form.transmission}
              onChange={(e) => updateField("transmission", e.target.value)}
            />
            <Select
              label="Drivetrain"
              options={DRIVETRAINS}
              value={form.drivetrain || ""}
              onChange={(e) => updateField("drivetrain", e.target.value)}
            />
            <Input
              label="Seats"
              type="number"
              value={form.seats}
              onChange={(e) => updateField("seats", e.target.value)}
              min={1}
              max={15}
            />
            <Input
              label="Doors"
              type="number"
              value={form.doors}
              onChange={(e) => updateField("doors", e.target.value)}
              min={2}
              max={6}
            />
            <Input
              label="Mileage"
              type="number"
              value={form.mileage || ""}
              onChange={(e) => updateField("mileage", e.target.value)}
              placeholder="Current odometer"
            />
            <Input
              label="License Plate"
              value={form.licensePlate || ""}
              onChange={(e) => updateField("licensePlate", e.target.value)}
              placeholder="e.g. ABC-1234"
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Description"
              value={form.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the vehicle, its condition, and any special features..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Street Address"
              value={form.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Main St"
            />
            <Input
              label="City *"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Denver"
              required
            />
            <Select
              label="State *"
              options={STATES}
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
            />
            <Input
              label="ZIP Code"
              value={form.zipCode || ""}
              onChange={(e) => updateField("zipCode", e.target.value)}
              placeholder="80202"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Daily Price ($) *"
              type="number"
              value={form.dailyPrice || ""}
              onChange={(e) => updateField("dailyPrice", e.target.value)}
              placeholder="65.00"
              min={1}
              step="0.01"
              required
            />
            <Input
              label="Weekly Discount (%)"
              type="number"
              value={form.weeklyDiscount || ""}
              onChange={(e) => updateField("weeklyDiscount", e.target.value)}
              placeholder="10"
              min={0}
              max={100}
            />
            <Input
              label="Monthly Discount (%)"
              type="number"
              value={form.monthlyDiscount || ""}
              onChange={(e) => updateField("monthlyDiscount", e.target.value)}
              placeholder="20"
              min={0}
              max={100}
            />
            <Input
              label="Cleaning Fee ($)"
              type="number"
              value={form.cleaningFee || ""}
              onChange={(e) => updateField("cleaningFee", e.target.value)}
              placeholder="25.00"
              min={0}
              step="0.01"
            />
            <Input
              label="Delivery Fee ($)"
              type="number"
              value={form.deliveryFee || ""}
              onChange={(e) => updateField("deliveryFee", e.target.value)}
              placeholder="30.00"
              min={0}
              step="0.01"
            />
            <Input
              label="Daily Mileage Limit"
              type="number"
              value={form.dailyMileageLimit || ""}
              onChange={(e) => updateField("dailyMileageLimit", e.target.value)}
              placeholder="250 miles"
            />
            <Input
              label="Extra Mile Charge ($)"
              type="number"
              value={form.extraMileCharge || ""}
              onChange={(e) => updateField("extraMileCharge", e.target.value)}
              placeholder="0.35"
              min={0}
              step="0.01"
            />
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Booking Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              label="Booking Mode"
              options={[
                { value: "INSTANT", label: "Instant Book" },
                { value: "REQUEST", label: "Request to Book" },
              ]}
              value={form.bookingMode}
              onChange={(e) => updateField("bookingMode", e.target.value)}
            />
            <Input
              label="Min Trip Days"
              type="number"
              value={form.minTripDays}
              onChange={(e) => updateField("minTripDays", e.target.value)}
              min={1}
            />
            <Input
              label="Max Trip Days"
              type="number"
              value={form.maxTripDays}
              onChange={(e) => updateField("maxTripDays", e.target.value)}
              min={1}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.instantBookEligible || false}
                onChange={(e) => updateField("instantBookEligible", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Instant Book Eligible
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.deliveryEnabled}
                onChange={(e) => updateField("deliveryEnabled", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Delivery Enabled
            </label>
          </div>
          {form.deliveryEnabled && (
            <div className="mt-4 w-48">
              <Input
                label="Delivery Radius (miles)"
                type="number"
                value={form.deliveryRadius || ""}
                onChange={(e) => updateField("deliveryRadius", e.target.value)}
                placeholder="25"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {COMMON_FEATURES.map((feature) => (
              <label
                key={feature}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors hover:bg-gray-50 has-[:checked]:border-neutral-800 has-[:checked]:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={(form.features || []).includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                {feature}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photos */}
      {mode === "edit" && form.id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              vehicleId={form.id}
              images={images}
              onImagesChange={setImages}
            />
          </CardContent>
        </Card>
      )}

      {mode === "create" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              Photos can be uploaded after creating the vehicle. You will be
              redirected to the edit page to add images.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/vehicles")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Vehicle" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
