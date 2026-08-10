"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Star,
  Users,
  Fuel,
  Gauge,
  Calendar,
  Shield,
  Clock,
  Car,
  ChevronRight,
  Heart,
  Share2,
  Flag,
  Zap,
  Check,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  category: string;
  description?: string;
  seats: number;
  doors: number;
  fuelType: string;
  transmission: string;
  drivetrain?: string;
  mileage?: number;
  electricRange?: number;
  cargoSpace?: string;
  city?: string;
  state?: string;
  dailyPrice: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  cleaningFee?: number;
  deliveryFee?: number;
  dailyMileageLimit?: number;
  extraMileCharge?: number;
  fuelPolicy?: string;
  bookingMode: string;
  minTripDays: number;
  maxTripDays: number;
  deliveryEnabled: boolean;
  totalTrips: number;
  avgRating?: number;
  totalReviews: number;
  isCompanyOwned: boolean;
  images: { id: string; url: string; caption?: string; isPrimary: boolean }[];
  features: { id: string; name: string }[];
  host: {
    id: string;
    name?: string;
    firstName?: string;
    avatarUrl?: string;
    createdAt: string;
    hostProfile?: {
      bio?: string;
      responseRate?: number;
      responseTime?: number;
      superHost: boolean;
      totalTrips: number;
      avgRating?: number;
    };
  };
  reviews: {
    id: string;
    overallRating: number;
    comment?: string;
    createdAt: string;
    author: {
      id: string;
      name?: string;
      firstName?: string;
      avatarUrl?: string;
    };
  }[];
  addOns: {
    id: string;
    name: string;
    description?: string;
    pricePerDay: number;
  }[];
}

function ImageGallery({ images }: { images: Vehicle["images"] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const placeholderColors = [
    "from-green-400 to-green-600",
    "from-emerald-400 to-emerald-600",
    "from-teal-400 to-teal-600",
    "from-green-500 to-emerald-700",
  ];

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
        <Car className="w-24 h-24 text-white/60" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-100">
        {images[selectedIndex]?.url ? (
          <img
            src={images[selectedIndex].url}
            alt={images[selectedIndex].caption ?? "Vehicle"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br flex items-center justify-center",
              placeholderColors[selectedIndex % placeholderColors.length]
            )}
          >
            <Car className="w-24 h-24 text-white/60" />
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors",
                i === selectedIndex
                  ? "border-green-600"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full bg-gradient-to-br flex items-center justify-center",
                    placeholderColors[i % placeholderColors.length]
                  )}
                >
                  <Car className="w-5 h-5 text-white/60" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingWidget({ vehicle }: { vehicle: Vehicle }) {
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const numDays =
    pickupDate && returnDate
      ? Math.ceil(
          (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const subtotal = numDays * vehicle.dailyPrice;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee + (vehicle.cleaningFee ?? 0);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24">
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-bold text-gray-900">
          {formatCurrency(vehicle.dailyPrice)}
        </span>
        <span className="text-gray-500">/day</span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trip start
          </label>
          <input
            type="date"
            value={pickupDate}
            min={today}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trip end
          </label>
          <input
            type="date"
            value={returnDate}
            min={pickupDate || today}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
      </div>

      {numDays > 0 && (
        <div className="border-t border-gray-100 pt-4 mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              {formatCurrency(vehicle.dailyPrice)} x {numDays} day
              {numDays > 1 ? "s" : ""}
            </span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {vehicle.cleaningFee ? (
            <div className="flex justify-between">
              <span className="text-gray-600">Cleaning fee</span>
              <span>{formatCurrency(vehicle.cleaningFee)}</span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span className="text-gray-600">Service fee</span>
            <span>{formatCurrency(serviceFee)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      <Link
        href={
          pickupDate && returnDate
            ? `/booking/new?vehicleId=${vehicle.id}&pickupDate=${pickupDate}&returnDate=${returnDate}`
            : "#"
        }
        className={cn(
          "block w-full text-center py-3 rounded-xl font-semibold text-white transition-colors",
          pickupDate && returnDate
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-300 cursor-not-allowed"
        )}
      >
        {vehicle.bookingMode === "INSTANT" ? "Book Instantly" : "Request to Book"}
      </Link>

      <p className="text-xs text-gray-500 text-center mt-3">
        {vehicle.bookingMode === "INSTANT"
          ? "Instant confirmation"
          : "Host will respond within 24 hours"}
      </p>
    </div>
  );
}

export default function VehicleDetailPage() {
  const params = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await fetch(`/api/vehicles/${params.slug}`);
        if (!res.ok) throw new Error("Vehicle not found");
        const data = await res.json();
        setVehicle(data);
      } catch {
        setError("Vehicle not found");
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Vehicle not found
        </h1>
        <p className="text-gray-500 mb-6">
          This listing may no longer be available.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
        >
          Browse vehicles
        </Link>
      </div>
    );
  }

  const hostName =
    vehicle.host.firstName ?? vehicle.host.name ?? "Host";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/search" className="hover:text-green-600">
          Search
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </span>
      </nav>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ImageGallery images={vehicle.images} />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                  {vehicle.trim ? ` ${vehicle.trim}` : ""}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-gray-600">
                  {vehicle.avgRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">
                        {vehicle.avgRating.toFixed(1)}
                      </span>
                      <span>({vehicle.totalReviews} reviews)</span>
                    </div>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {vehicle.city}, {vehicle.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    {vehicle.totalTrips} trips
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {vehicle.isCompanyOwned && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Joy Rental Express Fleet
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Vehicle specs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-medium">{vehicle.seats}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Gauge className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-medium">
                    {vehicle.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Fuel className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Fuel</p>
                  <p className="font-medium capitalize">
                    {vehicle.fuelType.toLowerCase().replace("_", " ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Car className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Doors</p>
                  <p className="font-medium">{vehicle.doors}</p>
                </div>
              </div>
              {vehicle.electricRange && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Zap className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">EV Range</p>
                    <p className="font-medium">{vehicle.electricRange} mi</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {vehicle.description && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>
          )}

          {vehicle.features.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Features
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vehicle.features.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                    {f.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {vehicle.addOns.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Available add-ons
              </h2>
              <div className="space-y-3">
                {vehicle.addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{addon.name}</p>
                      {addon.description && (
                        <p className="text-sm text-gray-500">
                          {addon.description}
                        </p>
                      )}
                    </div>
                    <span className="font-medium text-green-600">
                      {formatCurrency(addon.pricePerDay)}/day
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Policies
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium">Mileage</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {vehicle.dailyMileageLimit
                    ? `${vehicle.dailyMileageLimit} miles/day included. ${formatCurrency(vehicle.extraMileCharge ?? 0.45)}/extra mile.`
                    : "Unlimited mileage"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium">Fuel policy</h3>
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {vehicle.fuelPolicy?.replace(/-/g, " ") ?? "Return at same level"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium">Trip length</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Min {vehicle.minTripDays} day{vehicle.minTripDays > 1 ? "s" : ""}
                  , max {vehicle.maxTripDays} days
                </p>
              </div>
              {vehicle.deliveryEnabled && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium">Delivery available</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {vehicle.deliveryFee
                      ? `${formatCurrency(vehicle.deliveryFee)} delivery fee`
                      : "Free delivery"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {vehicle.weeklyDiscount || vehicle.monthlyDiscount ? (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Discounts
              </h2>
              <div className="flex gap-3">
                {vehicle.weeklyDiscount ? (
                  <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-medium">
                    {vehicle.weeklyDiscount}% off weekly
                  </div>
                ) : null}
                {vehicle.monthlyDiscount ? (
                  <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-medium">
                    {vehicle.monthlyDiscount}% off monthly
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hosted by {hostName}
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                {hostName[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {hostName}
                  </span>
                  {vehicle.host.hostProfile?.superHost && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Superhost
                    </span>
                  )}
                </div>
                {vehicle.host.hostProfile && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    {vehicle.host.hostProfile.avgRating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {vehicle.host.hostProfile.avgRating.toFixed(1)}
                      </span>
                    )}
                    <span>
                      {vehicle.host.hostProfile.totalTrips} trips
                    </span>
                    {vehicle.host.hostProfile.responseTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {vehicle.host.hostProfile.responseTime < 60
                          ? `${vehicle.host.hostProfile.responseTime}min`
                          : `${Math.round(vehicle.host.hostProfile.responseTime / 60)}hr`}{" "}
                        response
                      </span>
                    )}
                  </div>
                )}
                {vehicle.host.hostProfile?.bio && (
                  <p className="text-sm text-gray-600">
                    {vehicle.host.hostProfile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {vehicle.reviews.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Reviews ({vehicle.totalReviews})
              </h2>
              <div className="space-y-4">
                {vehicle.reviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {(review.author.firstName ?? review.author.name ?? "?")?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {review.author.firstName ?? review.author.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5",
                              i < review.overallRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 pb-4">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <Flag className="w-4 h-4" />
              Report this listing
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <BookingWidget vehicle={vehicle} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(vehicle.dailyPrice)}
            </span>
            <span className="text-gray-500 text-sm"> /day</span>
          </div>
          <Link
            href={`/booking/new?vehicleId=${vehicle.id}`}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            {vehicle.bookingMode === "INSTANT"
              ? "Book Instantly"
              : "Request to Book"}
          </Link>
        </div>
      </div>
    </div>
  );
}
