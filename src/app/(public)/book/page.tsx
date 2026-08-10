"use client";

import dynamic from "next/dynamic";

const WheelbaseStore = dynamic(
  () =>
    import("@/components/wheelbase/wheelbase-store").then(
      (mod) => mod.WheelbaseStore
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          <p className="text-sm text-gray-500">Loading rental store...</p>
        </div>
      </div>
    ),
  }
);

export default function BookPage() {
  const dealerId = process.env.NEXT_PUBLIC_WHEELBASE_DEALER_ID || "";

  if (!dealerId) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Booking Store
        </h1>
        <p className="text-gray-500">
          The booking engine is not configured yet. Please set your
          NEXT_PUBLIC_WHEELBASE_DEALER_ID environment variable.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <WheelbaseStore
        dealerId={dealerId}
        storeType="auto"
        primaryColor="#16a34a"
        secondaryColor="#f59e0b"
        showReviews
        hideLocaleSelector
        locale="en-us"
      />
    </div>
  );
}
