import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Peak Drive Rentals",
  description:
    "Read the Terms of Service for Peak Drive Rentals car rental marketplace.",
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: [EFFECTIVE DATE]
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the Peak Drive Rentals platform, website, or
              mobile application (collectively, the "Service"), you agree to be
              bound by these Terms of Service ("Terms"). If you do not agree to
              these Terms, you may not use the Service. These Terms constitute a
              legally binding agreement between you and [COMPANY LEGAL NAME]
              ("Peak Drive Rentals," "we," "us," or "our"). We reserve the right
              to modify these Terms at any time, and your continued use of the
              Service after such modifications constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. User Accounts
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              To use certain features of the Service, you must create an
              account. You agree to provide accurate, current, and complete
              information during registration and to keep your account
              information updated. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 18 years old to create an account. To rent a
              vehicle, you must be at least 21 years old and hold a valid
              driver's license. We reserve the right to suspend or terminate
              accounts that violate these Terms, provide false information, or
              engage in fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. The Booking Process
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Peak Drive Rentals operates as a marketplace connecting vehicle
              hosts with renters. When you submit a booking request, you are
              making an offer to rent a vehicle under the terms specified in the
              listing. For vehicles with instant booking enabled, your booking is
              confirmed immediately upon successful payment authorization. For
              request-based bookings, the host must approve your request before
              the booking is confirmed.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All bookings are subject to vehicle availability, renter
              eligibility, and successful payment processing. We reserve the
              right to cancel any booking that we believe violates our policies
              or poses a safety risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Payments and Fees
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All prices are listed in US dollars (USD). The total cost of a
              booking includes the daily rental rate, applicable service fees,
              taxes, protection plan premiums (if selected), and any additional
              charges such as delivery fees, cleaning fees, or add-ons. A
              service fee is charged to renters to cover platform operations and
              customer support.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Payment is processed through our secure payment partner, Stripe.
              A security deposit hold may be placed on your payment method at
              the time of booking and released after the trip concludes without
              incident. Hosts are paid according to our payout schedule, minus
              applicable host service fees.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Cancellations and Refunds
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Cancellation policies vary by listing and are displayed at the
              time of booking. Generally, free cancellation is available up to
              48 hours before the scheduled pickup. Cancellations made between
              24 and 48 hours before pickup may be eligible for a 50% refund.
              No refund is provided for cancellations made less than 24 hours
              before pickup. For full details, refer to our Cancellation Policy
              page. Host cancellations are subject to penalties and may affect
              the host's standing on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. User Responsibilities
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Renters</strong> agree to operate vehicles safely and in
              compliance with all applicable laws, return vehicles on time and
              in the same condition received (normal wear excepted), report any
              accidents or damage immediately, and not permit unauthorized
              drivers to operate the vehicle.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Hosts</strong> agree to provide vehicles that are safe,
              clean, mechanically sound, and accurately described in their
              listings. Hosts must maintain valid registration, insurance, and
              inspection documentation for all listed vehicles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Peak Drive Rentals acts as a marketplace platform and is not a
              party to the rental agreement between hosts and renters. To the
              maximum extent permitted by law, [COMPANY LEGAL NAME] shall not
              be liable for any indirect, incidental, special, consequential,
              or punitive damages arising from or related to your use of the
              Service, including but not limited to vehicle damage, personal
              injury, property damage, lost profits, or data loss. Our total
              liability shall not exceed the amount of fees paid by you to Joy
              Rental Express in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Dispute Resolution and Arbitration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Any dispute, claim, or controversy arising out of or relating to
              these Terms or the use of the Service shall be resolved through
              binding arbitration administered by the American Arbitration
              Association (AAA) under its Consumer Arbitration Rules. The
              arbitration shall take place in the state where you reside, and
              the arbitrator's decision shall be final and binding.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You agree to waive your right to participate in a class action
              lawsuit or class-wide arbitration. You may opt out of this
              arbitration clause by sending written notice to [COMPANY LEGAL
              NAME] within 30 days of first accepting these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Modifications and Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We may revise these Terms at any time by posting the updated version on the Service. Material changes will be communicated via email or platform notice at least 30 days before taking effect. Continued use after the effective date constitutes acceptance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. For questions, contact us at{" "}
              <a href="mailto:legal@peakdriverentals.com" className="text-neutral-800 hover:underline">legal@peakdriverentals.com</a>{" "}
              or write to [COMPANY LEGAL NAME] at our registered business address.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
