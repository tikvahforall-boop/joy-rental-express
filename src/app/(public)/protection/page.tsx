import { Shield, Check, X, AlertTriangle } from "lucide-react";
import { INSURANCE_TIERS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protection Plans | Joy Rental Express",
  description: "Learn about vehicle protection and insurance options available on Joy Rental Express.",
};

const coverageComparison = [
  { feature: "Liability Coverage", basic: true, standard: true, premium: true, premiumPlus: true },
  { feature: "Collision Coverage", basic: false, standard: true, premium: true, premiumPlus: true },
  { feature: "Comprehensive Coverage", basic: false, standard: false, premium: true, premiumPlus: true },
  { feature: "Personal Injury Protection", basic: false, standard: true, premium: true, premiumPlus: true },
  { feature: "Roadside Assistance", basic: false, standard: false, premium: true, premiumPlus: true },
  { feature: "Loss of Use", basic: false, standard: false, premium: false, premiumPlus: true },
];

export default function ProtectionPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="container-page text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Protection Plans
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Drive with peace of mind. Choose the protection level that's right
            for your trip.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {INSURANCE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`relative p-6 rounded-2xl border-2 ${
                  tier.id === "premium"
                    ? "border-green-600 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                {tier.id === "premium" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    ${tier.deductible.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500"> deductible</span>
                </div>
                <div className="text-sm text-gray-500">
                  Pricing shown during booking
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-page max-w-5xl">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Coverage Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Basic
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Standard
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-green-600 font-semibold">
                    Premium
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">
                    Premium+
                  </th>
                </tr>
              </thead>
              <tbody>
                {coverageComparison.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {row.feature}
                    </td>
                    {[row.basic, row.standard, row.premium, row.premiumPlus].map(
                      (included, i) => (
                        <td key={i} className="text-center py-3 px-4">
                          {included ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  Important Notice
                </h3>
                <p className="text-sm text-amber-700">
                  Protection plans are provided through our insurance partners
                  and are subject to terms, conditions, and eligibility
                  requirements. Coverage details, pricing, and availability may
                  vary by state and vehicle type. Protection is only active when
                  confirmed through the booking process with a valid policy
                  number. For detailed terms, refer to the policy documents
                  provided at the time of booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
