"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const WheelbaseListing = dynamic(
  () =>
    import("@/components/wheelbase/wheelbase-listing").then(
      (mod) => mod.WheelbaseListing
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          <p className="text-sm text-gray-500">Loading rental details...</p>
        </div>
      </div>
    ),
  }
);

export default function RentalDetailPage() {
  const params = useParams();
  const rentalId = params.rentalId as string;
  const dealerId = process.env.NEXT_PUBLIC_WHEELBASE_DEALER_ID || "";

  if (!dealerId) {
    return (
      <div className="container-page py-16 text-center">
        <p className="text-gray-500">Booking engine not configured.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Link
          href="/book"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all rentals
        </Link>
      </div>
      <WheelbaseListing
        dealerId={dealerId}
        rentalId={rentalId}
        showReviews
        primaryColor="#16a34a"
      />
    </div>
  );
}
