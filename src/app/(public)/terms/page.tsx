import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Peak Drive Rentals",
  description:
    "Read the Terms of Service for Peak Drive Rentals car rental marketplace in Denver, Colorado.",
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: August 15, 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the Peak Drive Rentals platform, website
              (peakdriverentals.com), or any related services (collectively, the
              &ldquo;Service&rdquo;), you agree to be bound by these Terms of
              Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms,
              you may not use the Service. These Terms constitute a legally
              binding agreement between you and Peak Drive Denver LLC, doing
              business as Peak Drive Rentals (&ldquo;Peak Drive Rentals,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
              a company registered in the State of Colorado. We reserve the
              right to modify these Terms at any time, and your continued use of
              the Service after such modifications constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Eligibility
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              To create an account on Peak Drive Rentals, you must be at least
              18 years of age. To rent a vehicle through the Service, you must
              meet all of the following requirements:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Be at least 21 years of age (drivers under 25 may be subject to a young driver surcharge)</li>
              <li>Hold a valid, unexpired U.S. driver&apos;s license or a valid international driver&apos;s permit accompanied by a foreign license</li>
              <li>Have a clean driving record with no major violations in the past 3 years</li>
              <li>Provide a valid payment method in your name</li>
              <li>Carry a minimum of state-required auto liability insurance, unless purchasing a protection plan through the Service</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              We reserve the right to verify your identity, driving record, and
              insurance coverage before approving any rental. Providing false or
              misleading information is grounds for immediate account
              termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. User Accounts
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You agree to provide accurate, current, and complete information
              during registration and to keep your account information updated
              at all times. You are solely responsible for maintaining the
              confidentiality of your account credentials and for all activities
              that occur under your account. You agree to notify us immediately
              of any unauthorized use of your account.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate
              these Terms, provide false information, engage in fraudulent
              activity, or pose a risk to the safety of our community.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Vehicle Rentals and Booking
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Peak Drive Rentals operates as a vehicle rental service and
              marketplace based in Denver, Colorado. When you submit a booking
              request, you are entering into a rental agreement subject to these
              Terms and any additional terms displayed at the time of booking.
              All bookings are processed through our secure reservation system
              powered by Wheelbase.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              All bookings are subject to vehicle availability, renter
              eligibility, and successful payment processing. We reserve the
              right to cancel any booking that we believe violates our policies,
              poses a safety risk, or involves fraudulent activity.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You agree to pick up and return the vehicle at the agreed-upon
              times and locations. Late returns may result in additional charges
              at the applicable daily rate plus a late fee. Failure to return a
              vehicle within 24 hours of the scheduled return time without
              contacting us may be considered unauthorized use and reported to
              law enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Payments, Fees, and Deposits
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All prices are listed in US dollars (USD). The total cost of a
              rental includes the applicable rental rate (daily, weekly, or
              monthly), service fees, applicable state and local taxes,
              protection plan premiums (if selected), and any additional charges
              such as delivery fees, cleaning fees, mileage overages, or fuel
              charges.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              A security deposit may be authorized on your payment method at the
              time of booking. This hold is released after the vehicle is
              returned in satisfactory condition, typically within 3&ndash;5
              business days. You are responsible for any damages, traffic
              violations, toll charges, or cleaning fees incurred during your
              rental period.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to charge your payment method on file for any
              outstanding fees, damages, violations, or charges arising from
              your rental, even after the rental period has concluded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Cancellations and Refunds
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Our standard cancellation policy is as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Free cancellation</strong> &mdash; More than 48 hours before scheduled pickup: full refund</li>
              <li><strong>Late cancellation</strong> &mdash; Between 24 and 48 hours before pickup: 50% refund of the rental amount</li>
              <li><strong>No refund</strong> &mdash; Less than 24 hours before pickup or no-show</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Refunds are processed to the original payment method within
              5&ndash;10 business days. Service fees are non-refundable except in
              cases where Peak Drive Rentals cancels the booking. We reserve the
              right to make exceptions to this policy at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Long-Term Rental Program
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Peak Drive Rentals offers weekly and monthly rental rates for
              select vehicles through our Long-Term Rental Program. Long-term
              rentals are subject to the following additional terms:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Long-term rates are available for rentals of 7 days (weekly) or 30 days (monthly) or more</li>
              <li>Payment is due in advance for the full rental period, or on a recurring monthly basis as agreed</li>
              <li>Early termination of a long-term rental may result in the difference between the long-term rate and the standard daily rate being charged for the days used</li>
              <li>Vehicles must be returned for scheduled maintenance inspections as requested by Peak Drive Rentals</li>
              <li>Mileage limits may apply; excess mileage is billed at the rate specified in your rental agreement</li>
              <li>Long-term renters are responsible for routine vehicle care including fuel, tire pressure, and fluid levels</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Long-term rental availability, pricing, and specific terms may
              vary by vehicle. All long-term rentals are subject to periodic
              review and may be terminated by either party with 7 days&apos;
              written notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Rent-to-Own Program
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Peak Drive Rentals offers a Rent-to-Own Program for select
              vehicles, allowing qualified applicants to make monthly payments
              toward vehicle ownership. The Rent-to-Own Program is subject to
              the following additional terms:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Participation requires a completed application and approval by Peak Drive Rentals; submitting an application does not guarantee acceptance</li>
              <li>Approved applicants must pay the specified down payment before taking possession of the vehicle</li>
              <li>Monthly payments are due on the agreed-upon date each month; late payments may incur a fee of up to $50 or 5% of the monthly payment, whichever is greater</li>
              <li>The vehicle remains the property of Peak Drive Rentals until all payments are made in full and the title is formally transferred</li>
              <li>You must maintain comprehensive auto insurance on the vehicle for the duration of the program at your own expense</li>
              <li>You are responsible for all maintenance, repairs, registration, and inspection costs during the rent-to-own period</li>
              <li>Failure to make payments for two consecutive months constitutes a default, and Peak Drive Rentals reserves the right to repossess the vehicle; payments made prior to default are non-refundable</li>
              <li>Early buyout is available at any time; contact us for a payoff amount</li>
              <li>The vehicle may not be modified, subleased, or used for commercial purposes without prior written consent</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Upon successful completion of all payments, Peak Drive Rentals
              will transfer the vehicle title to you within 30 days at no
              additional cost. The purchase price, down payment, monthly payment,
              and term length for each vehicle are displayed on the vehicle
              listing and confirmed in your Rent-to-Own Agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Vehicle Use and Renter Responsibilities
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              As a renter, you agree to the following:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Operate the vehicle safely and in compliance with all applicable federal, state, and local laws</li>
              <li>Only allow authorized drivers listed on the rental agreement to operate the vehicle</li>
              <li>Return the vehicle on time, with the same fuel level, and in the same condition as received (normal wear excepted)</li>
              <li>Report any accidents, damage, mechanical issues, or theft immediately to Peak Drive Rentals and local authorities</li>
              <li>Not use the vehicle for any illegal activity, racing, off-road driving (unless the vehicle is designated for off-road use), towing, or rideshare/delivery services</li>
              <li>Not smoke or vape in the vehicle (a cleaning fee of up to $250 will be assessed for violations)</li>
              <li>Not transport pets without prior approval (a cleaning fee may apply)</li>
              <li>Not drive the vehicle outside the State of Colorado without prior written approval</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Violation of any of these terms may result in additional charges,
              loss of protection plan coverage, account suspension, and/or legal
              action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Insurance and Protection Plans
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All rentals require that the renter carry minimum auto liability
              insurance as required by the State of Colorado. Peak Drive Rentals
              offers optional protection plans that provide additional coverage
              for collision damage, comprehensive damage, and liability. Details
              of available protection plans, including coverage limits,
              deductibles, and exclusions, are presented during the booking
              process.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Protection plans do not cover damage resulting from violations of
              these Terms (including but not limited to unauthorized use, illegal
              activity, or driving under the influence), nor do they cover
              personal belongings left in the vehicle. You are responsible for
              any damage costs exceeding the coverage limits of your selected
              protection plan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              To the maximum extent permitted by applicable law, Peak Drive
              Denver LLC and its officers, directors, employees, and agents shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from or related to your
              use of the Service, including but not limited to vehicle damage,
              personal injury, property damage, lost profits, loss of data, or
              loss of use.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our total aggregate liability to you for all claims arising out of
              or related to these Terms or your use of the Service shall not
              exceed the total amount of fees you have paid to Peak Drive
              Rentals in the twelve (12) months immediately preceding the event
              giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              12. Indemnification
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Peak Drive
              Denver LLC, its officers, directors, employees, agents, and
              affiliates from and against any and all claims, liabilities,
              damages, losses, costs, and expenses (including reasonable
              attorneys&apos; fees) arising out of or related to: (a) your use
              of the Service or any vehicle rented through the Service; (b) your
              violation of these Terms; (c) your violation of any applicable law
              or regulation; or (d) any damage, injury, or harm caused to any
              third party in connection with your use of a rented vehicle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              13. Dispute Resolution
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We encourage you to contact us first to resolve any disputes
              informally. You may reach our support team at{" "}
              <a
                href="mailto:support@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                support@peakdriverentals.com
              </a>
              . We will make every reasonable effort to resolve your concern
              within 30 days.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              If a dispute cannot be resolved informally, you agree that any
              claim or controversy arising out of or relating to these Terms or
              the Service shall be resolved through binding arbitration
              administered by the American Arbitration Association (AAA) under
              its Consumer Arbitration Rules. The arbitration shall take place
              in Denver, Colorado, and the arbitrator&apos;s decision shall be
              final and binding.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You agree to waive your right to participate in a class action
              lawsuit or class-wide arbitration. You may opt out of this
              arbitration clause by sending written notice to Peak Drive Denver
              LLC within 30 days of first accepting these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              14. Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your privacy is important to us. Our collection, use, and
              disclosure of your personal information is governed by our{" "}
              <a
                href="/privacy"
                className="text-neutral-800 hover:underline"
              >
                Privacy Policy
              </a>
              , which is incorporated into these Terms by reference. By using
              the Service, you consent to the practices described in the Privacy
              Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              15. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Service, including but not limited to text,
              graphics, logos, images, software, and the overall design and
              layout, is the property of Peak Drive Denver LLC or its licensors
              and is protected by United States and international copyright,
              trademark, and other intellectual property laws. You may not copy,
              reproduce, distribute, modify, or create derivative works from any
              content on the Service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              16. Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may suspend or terminate your account and access to the Service
              at any time, with or without cause, and with or without notice.
              Upon termination, your right to use the Service ceases
              immediately. Any outstanding obligations, including unpaid fees,
              damages, or pending disputes, survive termination. You may delete
              your account at any time by contacting us at{" "}
              <a
                href="mailto:support@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                support@peakdriverentals.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              17. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of the State of Colorado, without regard to its conflict
              of law provisions. Any legal action or proceeding not subject to
              arbitration shall be brought exclusively in the state or federal
              courts located in Denver County, Colorado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              18. Changes to These Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may revise these Terms at any time by posting the updated
              version on the Service. Material changes will be communicated via
              email or platform notification at least 30 days before taking
              effect. The &ldquo;Last updated&rdquo; date at the top of this
              page indicates when these Terms were last revised. Your continued
              use of the Service after the effective date of any changes
              constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              19. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">Peak Drive Denver LLC</p>
              <p>d/b/a Peak Drive Rentals</p>
              <p>Denver, Colorado</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:legal@peakdriverentals.com"
                  className="text-neutral-800 hover:underline"
                >
                  legal@peakdriverentals.com
                </a>
              </p>
              <p>
                Support:{" "}
                <a
                  href="mailto:support@peakdriverentals.com"
                  className="text-neutral-800 hover:underline"
                >
                  support@peakdriverentals.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
