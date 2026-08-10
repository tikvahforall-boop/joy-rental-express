"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Car,
  Shield,
  Clock,
  MessageCircle,
  Download,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Booking {
  id: string;
  bookingRef: string;
  status: string;
  pickupDate: string;
  returnDate: string;
  pickupType: string;
  pickupAddress?: string;
  numDays: number;
  totalPrice: number;
  serviceFee: number;
  taxAmount: number;
  insuranceFee: number;
  vehicle: {
    make: string;
    model: string;
    year: number;
    slug: string;
    city?: string;
    state?: string;
    images: { url: string }[];
    host: {
      name?: string;
      firstName?: string;
      phone?: string;
    };
  };
  priceBreakdown: { label: string; type: string; total: number }[];
  insurancePolicy?: { coverageTier: string; status: string } | null;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`)
      .then((r) => r.json())
      .then(setBooking)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-page py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Booking not found</h1>
        <Link
          href="/search"
          className="mt-4 inline-block text-green-600 hover:underline"
        >
          Browse vehicles
        </Link>
      </div>
    );
  }

  const isConfirmed =
    booking.status === "CONFIRMED" || booking.status === "PENDING_APPROVAL";
  const hostName =
    booking.vehicle.host.firstName ?? booking.vehicle.host.name ?? "Host";

  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {booking.status === "CONFIRMED"
            ? "Booking Confirmed!"
            : "Booking Request Submitted!"}
        </h1>
        <p className="text-gray-600">
          {booking.status === "CONFIRMED"
            ? "Your reservation is confirmed. Get ready for your trip!"
            : "Your host will review your request and respond within 24 hours."}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          Reservation #{booking.bookingRef}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Trip details
          </h2>
          <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="w-24 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Car className="w-10 h-10 text-white/60" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.vehicle.year} {booking.vehicle.make}{" "}
                {booking.vehicle.model}
              </h3>
              <p className="text-sm text-gray-500">
                {booking.vehicle.city}, {booking.vehicle.state}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Pickup</div>
                <div className="text-gray-600">
                  {formatDate(booking.pickupDate)}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Return</div>
                <div className="text-gray-600">
                  {formatDate(booking.returnDate)}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Pickup method</div>
                <div className="text-gray-600 capitalize">
                  {booking.pickupType}
                  {booking.pickupAddress && ` - ${booking.pickupAddress}`}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Duration</div>
                <div className="text-gray-600">
                  {booking.numDays} day{booking.numDays > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Price breakdown
          </h2>
          <div className="space-y-2 text-sm">
            {booking.priceBreakdown.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-600">{item.label}</span>
                <span
                  className={
                    item.type === "discount"
                      ? "text-green-600"
                      : "text-gray-900"
                  }
                >
                  {item.type === "discount" ? "-" : ""}
                  {formatCurrency(Math.abs(item.total))}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your host
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
              {hostName[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{hostName}</div>
              <div className="text-sm text-gray-500">
                You can message your host through the dashboard
              </div>
            </div>
          </div>
        </div>

        {booking.insuranceFee > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">
                  Protection plan selected
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  {booking.insurancePolicy
                    ? `Your ${booking.insurancePolicy.coverageTier} protection is ${booking.insurancePolicy.status}.`
                    : "Your protection selection will be confirmed with your booking. Coverage is only active upon confirmed policy issuance."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/bookings"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            View My Trips
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
