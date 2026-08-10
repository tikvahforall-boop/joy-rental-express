import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy | Joy Rental Express",
  description:
    "Understand the cancellation and refund policies for bookings on Joy Rental Express.",
};

const policies = [
  {
    name: "Flexible",
    description:
      "Best for renters who want maximum flexibility. Ideal for uncertain travel plans.",
    rules: [
      { window: "48+ hours before pickup", refund: "Full refund" },
      { window: "24 - 48 hours before pickup", refund: "50% refund" },
      { window: "Less than 24 hours", refund: "No refund" },
    ],
  },
  {
    name: "Moderate",
    description:
      "A balanced policy offering reasonable flexibility with host protection.",
    rules: [
      { window: "5+ days before pickup", refund: "Full refund" },
      { window: "2 - 5 days before pickup", refund: "50% refund" },
      { window: "Less than 2 days", refund: "No refund" },
    ],
  },
  {
    name: "Strict",
    description:
      "Provides hosts with the most booking certainty. Lower daily rates may apply.",
    rules: [
      { window: "7+ days before pickup", refund: "50% refund" },
      { window: "Less than 7 days", refund: "No refund" },
    ],
  },
];

export default function CancellationPolicyPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Cancellation Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: [EFFECTIVE DATE]
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <p className="text-gray-600 leading-relaxed">
              We understand plans change. Joy Rental Express offers three cancellation policy tiers that hosts choose for their listings. The applicable policy is displayed on each listing and at checkout. Service fees are refunded in full for cancellations that qualify for a full refund; otherwise, service fees are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Default Cancellation Rules
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Unless the listing specifies a different policy, the following
              default (Flexible) rules apply to all bookings:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Cancellation Window
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Refund
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      48 or more hours before scheduled pickup
                    </td>
                    <td className="py-3 px-4 text-sm text-green-700 font-medium">
                      Full refund
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      24 to 48 hours before scheduled pickup
                    </td>
                    <td className="py-3 px-4 text-sm text-amber-700 font-medium">
                      50% refund
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      Less than 24 hours before scheduled pickup
                    </td>
                    <td className="py-3 px-4 text-sm text-red-700 font-medium">
                      No refund
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Policy Tiers
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Hosts choose one of three cancellation tiers when creating their
              listing. Each tier balances renter flexibility with host booking
              certainty.
            </p>
            <div className="space-y-6">
              {policies.map((policy) => (
                <div
                  key={policy.name}
                  className="border border-gray-200 rounded-xl p-5"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {policy.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {policy.description}
                  </p>
                  <div className="space-y-2">
                    {policy.rules.map((rule) => (
                      <div
                        key={rule.window}
                        className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-gray-600">{rule.window}</span>
                        <span
                          className={`font-medium ${
                            rule.refund === "Full refund"
                              ? "text-green-700"
                              : rule.refund === "50% refund"
                                ? "text-amber-700"
                                : "text-red-700"
                          }`}
                        >
                          {rule.refund}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Host Cancellations
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Hosts are expected to honor confirmed bookings. If a host cancels, the renter receives a full refund including all fees. Host penalties include:
            </p>
            <ul className="text-gray-600 space-y-1 list-disc pl-5">
              <li>Cancellation fee of $50 or 10% of the booking total (whichever is greater)</li>
              <li>Temporary reduction in listing search ranking</li>
              <li>Account suspension after 3 or more cancellations in 90 days</li>
              <li>Super Host status revoked for the current evaluation period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              No-Shows and Extenuating Circumstances
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If a renter does not pick up the vehicle within 2 hours of the scheduled pickup time without contacting the host, the booking may be treated as a no-show and is not eligible for any refund.
            </p>
            <p className="text-gray-600 leading-relaxed">
              In cases of documented emergencies such as natural disasters, government travel restrictions, or serious illness, Joy Rental Express may override the standard policy and issue a full refund at its discretion. Supporting documentation may be required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              How to Cancel
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Cancel from your dashboard under "My Trips." The applicable refund amount is displayed before you confirm. Refunds are processed within 5-10 business days to the original payment method. For assistance, contact{" "}
              <a href="mailto:support@joyrentalexpress.com" className="text-green-600 hover:underline">support@joyrentalexpress.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
