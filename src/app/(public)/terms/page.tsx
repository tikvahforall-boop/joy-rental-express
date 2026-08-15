import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Peak Drive Rentals",
  description:
    "Terms of Service for Peak Drive Rentals — vehicle rental and rent-to-own services in Denver, Colorado.",
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Last updated: August 15, 2026
        </p>

        <div className="mb-10 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold mb-1">
            PLEASE READ THESE TERMS OF SERVICE CAREFULLY.
          </p>
          <p>
            They contain important information that affects your rights,
            remedies, and obligations. They include an agreement to arbitrate
            disputes (unless you opt out within 30 days), a waiver of class
            action rights, various limitations and exclusions of liability, and
            obligations to comply with applicable laws and regulations, including
            Colorado state law and applicable federal law.
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Introduction and Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Tikvah Express LLC, a Colorado limited liability company doing
              business as Peak Drive Denver and Peak Drive Rentals
              (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;), operates a vehicle rental service and
              marketplace accessible at peakdriverentals.com and through related
              applications and services (collectively, the
              &ldquo;Service&rdquo;).
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              By accessing or using the Service, you agree to be bound by these
              Terms of Service (&ldquo;Terms&rdquo;). These Terms, together with
              our{" "}
              <Link href="/privacy" className="text-neutral-800 hover:underline">
                Privacy Policy
              </Link>
              ,{" "}
              <Link
                href="/cancellation-policy"
                className="text-neutral-800 hover:underline"
              >
                Cancellation Policy
              </Link>
              , and all other policies referenced herein (collectively, the
              &ldquo;Agreement&rdquo;), constitute a legally binding contract
              between you and the Company. If you do not agree to these Terms,
              you must not access or use the Service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Modification.</strong> We reserve the right to modify
              these Terms at any time by posting the updated version on the
              Service. Material changes will be communicated via email or
              platform notification at least thirty (30) days before taking
              effect. The &ldquo;Last updated&rdquo; date above indicates when
              these Terms were last revised. Your continued use of the Service
              after the effective date constitutes acceptance of the revised
              Terms. If the modified terms are not acceptable to you, your sole
              remedy is to stop using the Service and close your account within
              thirty (30) days.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Eligibility and Registration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Age requirement.</strong> You must be at least eighteen
              (18) years of age to create an account. To rent a vehicle through
              the Service, you must be at least twenty-one (21) years of age.
              Renters between the ages of 21 and 24 may be subject to a young
              driver surcharge as disclosed at the time of booking.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Driver&apos;s license.</strong> You must hold a valid,
              unexpired U.S. driver&apos;s license, or a valid international
              driver&apos;s permit accompanied by a foreign license issued in
              the country of your residence. Your license must authorize
              operation of the class of vehicle you intend to rent.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Insurance.</strong> In accordance with Colorado Revised
              Statutes (&ldquo;C.R.S.&rdquo;) &sect; 10-4-619, all operators of
              motor vehicles on Colorado roads must carry minimum liability
              insurance. Colorado requires minimum coverage of $25,000 per
              person / $50,000 per accident for bodily injury and $15,000 for
              property damage (C.R.S. &sect; 10-4-620). You must carry at least
              these minimums or purchase a protection plan offered through the
              Service.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Driving record.</strong> You must have a clean driving
              record with no DUI/DWI convictions or reckless driving violations
              within the past five (5) years and no more than two (2) at-fault
              accidents or moving violations within the past three (3) years.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Account information.</strong> You agree to provide
              accurate, current, and complete information during registration
              and to keep your account information updated. You are solely
              responsible for maintaining the confidentiality of your account
              credentials and for all activities that occur under your account.
              You agree to notify us immediately of any unauthorized use.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Verification.</strong> We reserve the right to verify your
              identity, driving record, and insurance coverage before approving
              any rental. In accordance with the Fair Credit Reporting Act
              (15 U.S.C. &sect; 1681 et seq.), you authorize us to obtain your
              driving record and, where applicable, conduct a background check
              through third-party services. Providing false or misleading
              information is grounds for immediate account termination.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Vehicle Rentals and Booking
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All bookings are processed through our reservation system. When
              you submit a booking request, you are entering into a rental
              agreement subject to these Terms and any additional terms
              displayed at the time of booking.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              All bookings are subject to vehicle availability, renter
              eligibility, and successful payment authorization. We reserve the
              right to cancel any booking that we believe violates our policies,
              poses a safety risk, or involves fraudulent activity.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              You agree to pick up and return the vehicle at the agreed-upon
              times and locations. Late returns may result in additional charges
              at the applicable daily rate plus a late return fee. Failure to
              return a vehicle within twenty-four (24) hours of the scheduled
              return time without contacting us may be considered unauthorized
              use and reported to law enforcement authorities in accordance with
              C.R.S. &sect; 18-4-401 (theft) and &sect; 18-4-409 (aggravated
              motor vehicle theft).
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>No transfer of ownership.</strong> Except as expressly
              provided under a Rent-to-Own Agreement (Section 8), nothing in
              these Terms constitutes a transfer or assignment of any ownership
              interest in any vehicle. All vehicles remain the property of
              Tikvah Express LLC or the applicable vehicle owner during the
              rental period.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Payments, Fees, and Deposits
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All prices are listed in United States dollars (USD). The total
              cost of a rental includes the applicable rental rate (daily,
              weekly, or monthly), service fees, all applicable state and local
              taxes (including any Colorado motor vehicle rental tax), protection
              plan premiums (if selected), and any additional charges such as
              delivery fees, cleaning fees, mileage overages, fuel charges, or
              toll fees. In accordance with C.R.S. &sect; 6-1-206, all
              mandatory charges beyond the base rental rate are disclosed before
              booking confirmation.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Security deposit.</strong> A security deposit hold may be
              authorized on your payment method at the time of booking. This
              hold is released after the vehicle is returned in satisfactory
              condition, typically within three (3) to five (5) business days.
              You are financially responsible for any damages, traffic
              violations, toll charges, towing fees, or cleaning fees incurred
              during your rental period, regardless of fault.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Payment authorization.</strong> By providing a payment
              method, you authorize the Company, or third-party payment
              processors acting on our behalf, to store your payment credential
              and charge it for any outstanding fees, damages, violations, or
              charges arising from your rental, including charges incurred after
              the rental period has concluded.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Collections.</strong> If amounts owed remain unpaid, the
              Company may engage collection agencies or legal counsel to collect
              outstanding balances. Delinquent accounts may be reported to
              credit bureaus and may be charged additional collection fees.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Cancellations and Refunds
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Our standard cancellation policy is as follows:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                <strong>Free cancellation</strong> &mdash; More than forty-eight
                (48) hours before scheduled pickup: full refund of the rental
                amount
              </li>
              <li>
                <strong>Late cancellation</strong> &mdash; Between twenty-four
                (24) and forty-eight (48) hours before pickup: fifty percent
                (50%) refund of the rental amount
              </li>
              <li>
                <strong>No refund</strong> &mdash; Less than twenty-four (24)
                hours before pickup, or no-show
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Refunds are processed to the original payment method within five
              (5) to ten (10) business days. Service fees are non-refundable
              except where the Company cancels the booking. We reserve the right
              to make exceptions to this policy at our sole discretion.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Insurance and Protection Plans
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Your insurance obligation.</strong> Colorado law (C.R.S.
              &sect; 10-4-619) requires all operators of motor vehicles to carry
              minimum liability insurance. You must maintain at least the
              state-required minimums of $25,000/$50,000/$15,000 (C.R.S.
              &sect; 10-4-620) or purchase a protection plan through the
              Service.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Collision damage waiver disclosure.</strong> In compliance
              with C.R.S. &sect; 6-1-201 through &sect; 6-1-207, the Company
              may offer a collision damage waiver (&ldquo;CDW&rdquo;) for an
              additional charge. A CDW is a contractual provision whereby the
              Company waives or limits its right to recover from you for damage
              to the rented vehicle during the rental period. The purchase of a
              CDW is{" "}
              <strong>optional and is not required to rent a vehicle</strong>.
              Before purchasing a CDW, you should check whether your personal
              auto insurance policy or credit card provides similar coverage.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Protection plans.</strong> The Company offers optional
              protection plans that may provide additional coverage for
              collision damage, comprehensive events, and supplemental
              liability. Details of available plans, including coverage limits,
              deductibles, and exclusions, are presented during the booking
              process. Protection plans are not insurance policies and are
              subject to the terms and exclusions stated at the time of
              purchase.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Exclusions.</strong> Protection plans and CDWs do not
              cover damage resulting from violation of these Terms, including
              but not limited to unauthorized use, illegal activity, operation
              under the influence of drugs or alcohol, use by an unauthorized
              driver, off-road use, or operation outside the approved
              geographic area. Personal belongings left in the vehicle are not
              covered.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Owner liability limitation.</strong> Pursuant to the
              Graves Amendment (49 U.S.C. &sect; 30106), the Company, as the
              owner of rental vehicles engaged in the trade or business of
              renting motor vehicles, is not vicariously liable for harm arising
              from the use or operation of the vehicle during a rental period
              solely by reason of ownership, provided that the Company was not
              negligent and did not engage in criminal wrongdoing. This federal
              preemption applies to all claims based solely on vehicle
              ownership.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Long-Term Rental Program
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The Company offers weekly and monthly rental rates for select
              vehicles through our Long-Term Rental Program. In addition to the
              general terms above, long-term rentals are subject to the
              following:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                Long-term rates are available for rentals of seven (7) days
                (weekly) or thirty (30) days (monthly) or more
              </li>
              <li>
                Payment is due in advance for the full rental period, or on a
                recurring basis as specified in your rental agreement
              </li>
              <li>
                Early termination may result in retroactive adjustment to the
                standard daily rate for the actual days used, plus an early
                termination fee as specified in your rental agreement
              </li>
              <li>
                Vehicles must be returned for scheduled maintenance inspections
                as requested by the Company; failure to comply may result in
                termination of the rental
              </li>
              <li>
                Mileage limits may apply; excess mileage is billed at the rate
                specified in your rental agreement
              </li>
              <li>
                You are responsible for routine vehicle care during the rental
                period, including maintaining adequate fuel levels, tire
                pressure, and fluid levels
              </li>
              <li>
                Either party may terminate a long-term rental with seven (7)
                days&apos; written notice, subject to any early termination
                charges
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Rent-to-Own Program
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The Company offers a Rent-to-Own Program for select vehicles,
              allowing qualified applicants to make monthly payments toward
              vehicle ownership. The Rent-to-Own Program is governed by a
              separate Rent-to-Own Agreement executed between you and the
              Company, and is subject to the Colorado Rental Purchase Agreement
              Act (C.R.S. &sect; 5-10-101 et seq.) and the following additional
              terms:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                <strong>Application and approval.</strong> Participation
                requires a completed application and approval by the Company.
                Submitting an application does not guarantee acceptance. The
                Company reserves sole discretion in approving or denying
                applications
              </li>
              <li>
                <strong>Disclosures.</strong> In compliance with C.R.S.
                &sect; 5-10-301 et seq., your Rent-to-Own Agreement will clearly
                disclose the total cost of ownership, the payment schedule,
                individual payment amounts, the cash price of the vehicle, and
                all other charges
              </li>
              <li>
                <strong>Down payment.</strong> Approved applicants must pay the
                specified down payment before taking possession of the vehicle
              </li>
              <li>
                <strong>Monthly payments.</strong> Monthly payments are due on
                the date specified in your Rent-to-Own Agreement. Late payments
                may incur a fee of up to fifty dollars ($50) or five percent
                (5%) of the monthly payment, whichever is greater
              </li>
              <li>
                <strong>Ownership.</strong> The vehicle remains the sole
                property of Tikvah Express LLC until all payments are made in
                full and title is formally transferred. In accordance with
                C.R.S. &sect; 5-10-501, after the first payment, you may
                acquire ownership at any time by paying the remaining balance as
                specified in your agreement
              </li>
              <li>
                <strong>Early buyout.</strong> You may pay off the remaining
                balance at any time without prepayment penalty. Contact us for a
                current payoff amount
              </li>
              <li>
                <strong>Insurance requirement.</strong> You must maintain
                comprehensive and collision auto insurance on the vehicle for
                the entire duration of the Rent-to-Own period at your own
                expense, with Tikvah Express LLC listed as lienholder. Minimum
                coverage must meet or exceed Colorado state requirements (C.R.S.
                &sect; 10-4-620)
              </li>
              <li>
                <strong>Maintenance and care.</strong> You are responsible for
                all routine maintenance, repairs, registration, emission
                testing, and inspection costs during the Rent-to-Own period
              </li>
              <li>
                <strong>Prohibited actions.</strong> The vehicle may not be
                modified, subleased, used as collateral, or used for commercial
                purposes (including rideshare or delivery services) without
                prior written consent from the Company
              </li>
              <li>
                <strong>Default and repossession.</strong> Failure to make
                payments for two (2) consecutive months, failure to maintain
                required insurance, or material breach of the Rent-to-Own
                Agreement constitutes a default. Upon default, the Company
                reserves the right to repossess the vehicle in accordance with
                Colorado law (C.R.S. &sect; 4-9-609). Payments made prior to
                default are non-refundable, except as otherwise required by law
              </li>
              <li>
                <strong>Damage waivers.</strong> Any liability damage waiver
                offered in connection with a Rent-to-Own Agreement is subject to
                C.R.S. &sect; 5-10-603 and will be disclosed separately
              </li>
              <li>
                <strong>Title transfer.</strong> Upon successful completion of
                all payments, the Company will transfer the vehicle title to you
                within thirty (30) days at no additional cost. You are
                responsible for title transfer fees and registration with the
                Colorado Division of Motor Vehicles
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Any intentional violation of the Rent-to-Own Agreement by the
              Company constitutes a deceptive trade practice under C.R.S.
              &sect; 5-10-901 and the Colorado Consumer Protection Act (C.R.S.
              &sect; 6-1-105).
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Vehicle Use and Renter Responsibilities
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              When you rent a vehicle through the Service, you agree to use the
              vehicle solely for lawful, personal, or professional
              transportation purposes. You must exercise reasonable care in your
              use of the vehicle and comply with all applicable federal, state,
              and local laws at all times. Specifically, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                Operate the vehicle safely and in compliance with all traffic
                laws, including speed limits and prohibitions on impaired or
                distracted driving
              </li>
              <li>
                Only allow authorized drivers listed on the rental agreement to
                operate the vehicle
              </li>
              <li>
                Wear seat belts at all times and ensure all passengers do the
                same; comply with Colorado&apos;s child restraint laws (C.R.S.
                &sect; 42-4-236)
              </li>
              <li>
                Return the vehicle on time, with the same fuel level (or pay a
                refueling charge), and in the same condition as received (normal
                wear excepted)
              </li>
              <li>
                Report any accidents, damage, mechanical issues, or theft
                immediately to the Company and, where required, to local law
                enforcement. In Colorado, collisions resulting in injury, death,
                or property damage exceeding $1,000 must be reported to law
                enforcement (C.R.S. &sect; 42-4-1606)
              </li>
              <li>
                Not drive the vehicle outside the State of Colorado without
                prior written approval from the Company
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3 mb-3">
              <strong>Prohibited uses.</strong> The following uses are expressly
              prohibited and will void any applicable protection plan:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                Any illegal activity, including but not limited to
                transportation of controlled substances
              </li>
              <li>
                Racing, speed contests, or reckless driving
              </li>
              <li>
                Off-road driving (unless the vehicle is explicitly designated
                for off-road use)
              </li>
              <li>
                Use for commercial purposes requiring a commercial
                driver&apos;s license, including rideshare (Uber, Lyft) or
                delivery services, without prior written approval
              </li>
              <li>
                Towing or pushing any vehicle, trailer, or other object
              </li>
              <li>
                Smoking or vaping in the vehicle (a cleaning fee of up to $250
                will be assessed)
              </li>
              <li>
                Transporting pets without prior approval (a cleaning fee may
                apply)
              </li>
              <li>
                Permitting operation by any person who is unlicensed,
                intoxicated, or under the influence of any substance that
                impairs driving ability
              </li>
              <li>
                Leaving the vehicle unlocked or running with keys unsecured
              </li>
              <li>
                Subleasing, lending, or otherwise making the vehicle available
                to any third party
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Violation of any of these terms may result in additional charges,
              loss of protection plan coverage, account suspension, and/or civil
              or criminal legal action. You are fully financially responsible
              for any claims, loss, or damage arising from prohibited use.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Damage, Theft, and Incident Reporting
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Guest financial responsibility.</strong> You are
              financially responsible for all physical damage to, or theft of, a
              rented vehicle that occurs during the rental period, regardless of
              who is at fault. This responsibility applies whether or not you
              have your own auto insurance. You may limit your out-of-pocket
              exposure by purchasing a protection plan or CDW through the
              Service.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Incident reporting.</strong> You must report any damage to
              the vehicle to the Company immediately upon discovery and in no
              event more than twenty-four (24) hours after the incident. In the
              event of a collision involving injury or significant property
              damage, you must also file a report with law enforcement (C.R.S.
              &sect; 42-4-1606). Failure to timely report an incident or
              cooperate in an investigation may reduce or void any protection
              plan or CDW coverage.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Vehicle theft or failure to return.</strong> Failure to
              return the vehicle by the scheduled return time without obtaining
              an extension may be reported to law enforcement as unauthorized
              use or motor vehicle theft (C.R.S. &sect; 18-4-409). You are
              responsible for any investigation costs, towing fees, and a case
              administration fee of up to five hundred dollars ($500).
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Repossession.</strong> The Company or its authorized agent
              may repossess any vehicle without demand, at your expense, if the
              vehicle is not returned by the end of the rental period, is found
              illegally parked, or is used in violation of applicable law or
              these Terms.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
              AVAILABLE,&rdquo; WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR
              IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE
              COMPANY DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TIKVAH EXPRESS
              LLC AND ITS OFFICERS, DIRECTORS, MEMBERS, EMPLOYEES, AND AGENTS
              SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR
              USE OF THE SERVICE OR ANY VEHICLE, INCLUDING BUT NOT LIMITED TO
              PERSONAL INJURY, PROPERTY DAMAGE, LOST PROFITS, LOSS OF DATA, OR
              LOSS OF USE, REGARDLESS OF THE THEORY OF LIABILITY.
            </p>
            <p className="text-gray-600 leading-relaxed">
              OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF
              OR RELATED TO THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT
              EXCEED THE GREATER OF (A) THE TOTAL AMOUNT OF FEES YOU HAVE PAID
              TO THE COMPANY IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE
              EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED DOLLARS
              ($100.00). NOTHING IN THESE TERMS SHALL LIMIT LIABILITY FOR FRAUD,
              GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR ANY LIABILITY THAT CANNOT
              BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              12. Indemnification
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Tikvah Express
              LLC, its officers, directors, members, employees, agents, and
              affiliates from and against any and all claims, liabilities,
              damages, losses, costs, and expenses (including reasonable
              attorneys&apos; fees and court costs) arising out of or related to:
              (a) your use of the Service or any vehicle rented or leased
              through the Service; (b) your violation of these Terms or any
              applicable law or regulation; (c) your negligent, reckless, or
              intentional acts or omissions while operating a rented vehicle; or
              (d) any damage, injury, or harm caused to any third party in
              connection with your use of a rented vehicle. This
              indemnification obligation survives termination of these Terms and
              your use of the Service.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              13. Dispute Resolution and Arbitration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>
                PLEASE READ THIS SECTION CAREFULLY. IT CONTAINS A MANDATORY
                ARBITRATION PROVISION THAT AFFECTS YOUR LEGAL RIGHTS.
              </strong>
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Pre-arbitration dispute resolution.</strong> Before
              initiating arbitration, you agree to first contact the Company in
              writing at{" "}
              <a
                href="mailto:legal@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                legal@peakdriverentals.com
              </a>{" "}
              describing the nature of your dispute and the relief you seek. The
              Company will make every reasonable effort to resolve your concern
              informally within thirty (30) days.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Agreement to arbitrate.</strong> If a dispute cannot be
              resolved informally, you and the Company agree that any and all
              disputes, claims, or controversies arising out of or relating to
              these Terms, your use of the Service, or any vehicle rented
              through the Service shall be resolved by final and binding
              arbitration administered by the American Arbitration Association
              (&ldquo;AAA&rdquo;) under its Consumer Arbitration Rules. This
              agreement to arbitrate is governed by the Federal Arbitration Act
              (9 U.S.C. &sect; 1 et seq.) and evidences a transaction involving
              interstate commerce. The arbitration shall be conducted by a
              single arbitrator in Denver, Colorado, or at another mutually
              agreed location. You and the Company may attend by video or
              telephone.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Exceptions.</strong> The following are excepted from
              arbitration: (a) disputes that qualify for small claims court;
              (b) actions seeking injunctive or equitable relief to prevent
              infringement of intellectual property rights; and (c) any claim
              that cannot be arbitrated as a matter of applicable law.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Class action waiver.</strong> YOU AND THE COMPANY AGREE
              THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS
              INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
              PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. THE
              ARBITRATOR MAY AWARD RELIEF ONLY IN FAVOR OF THE INDIVIDUAL PARTY
              SEEKING RELIEF AND ONLY TO THE EXTENT NECESSARY TO RESOLVE THAT
              PARTY&apos;S INDIVIDUAL CLAIM.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Opt-out right.</strong> You may opt out of this
              arbitration clause by sending written notice to{" "}
              <a
                href="mailto:legal@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                legal@peakdriverentals.com
              </a>{" "}
              within thirty (30) days of first accepting these Terms. Your
              opt-out notice must include your full name, mailing address, and
              email address associated with your account. If you opt out, all
              other provisions of these Terms remain in effect.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Costs.</strong> Each party is responsible for its initial
              filing fees. If you prevail in arbitration and recover the full
              amount of your claim, the Company will reimburse your initial AAA
              filing fee. Each party bears its own attorneys&apos; fees except
              as provided by law.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Severability.</strong> If the class action waiver is found
              unenforceable, the entire arbitration provision shall be null and
              void. If any other part of this arbitration provision is found
              unenforceable, the remaining parts shall continue to apply.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              14. Colorado Consumer Protection Act Compliance
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              The Company is committed to fair dealing in compliance with the
              Colorado Consumer Protection Act (C.R.S. &sect; 6-1-105 et seq.).
              We do not engage in deceptive trade practices, including
              knowingly or recklessly misrepresenting the source,
              characteristics, benefits, quantities, or prices of our vehicles
              or services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Violations of the collision damage waiver disclosure requirements
              (C.R.S. &sect; 6-1-201 through &sect; 6-1-207) and violations of
              the Rental Purchase Agreement Act (C.R.S. &sect; 5-10-901) are
              per se deceptive trade practices. You have the right to pursue
              remedies under C.R.S. &sect; 6-1-113, including actual damages
              with a minimum recovery of five hundred dollars ($500) or treble
              damages, whichever is greater.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              15. Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your privacy is important to us. Our collection, use, and
              disclosure of personal information is governed by our{" "}
              <Link
                href="/privacy"
                className="text-neutral-800 hover:underline"
              >
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. By using
              the Service, you consent to the practices described in the Privacy
              Policy. We may contact you by electronic means (email, app
              notification, SMS) regarding your account, bookings, payments, and
              security matters. Standard message and data rates may apply. You
              may opt out of non-essential communications at any time.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              16. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Service, including but not limited to text,
              graphics, logos, images, software, and the design and layout of
              the website, is the property of Tikvah Express LLC or its
              licensors and is protected by United States and international
              copyright, trademark, and other intellectual property laws. You
              are granted a limited, revocable, non-exclusive, non-transferable
              license to access and use the Service for personal,
              non-commercial purposes. You may not copy, reproduce, distribute,
              modify, create derivative works from, or commercially exploit any
              content on the Service without prior written consent.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              17. Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may suspend or terminate your account and access to the Service
              at any time, with or without cause, and with or without notice, to
              the extent permitted by applicable law. Upon termination, your
              right to use the Service ceases immediately. Any outstanding
              obligations, including unpaid fees, damages, indemnification
              obligations, and pending disputes, survive termination. Sections
              11 (Limitation of Liability), 12 (Indemnification), 13 (Dispute
              Resolution), and 14 (Consumer Protection) shall survive
              termination of these Terms. You may close your account at any time
              by contacting us at{" "}
              <a
                href="mailto:support@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                support@peakdriverentals.com
              </a>
              .
            </p>
          </section>

          {/* 18 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              18. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              These Terms shall be governed by and construed in accordance with
              the laws of the State of Colorado, without regard to its conflict
              of law provisions, except to the extent preempted by federal law
              (including the Federal Arbitration Act and the Graves Amendment).
            </p>
            <p className="text-gray-600 leading-relaxed">
              For any legal action not subject to arbitration, you agree to
              submit to the exclusive personal jurisdiction of the state and
              federal courts located in the City and County of Denver, Colorado.
              You waive any objection to venue or jurisdiction in these courts.
            </p>
          </section>

          {/* 19 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              19. General Provisions
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Entire agreement.</strong> These Terms, together with the
              Privacy Policy, Cancellation Policy, and all policies referenced
              herein, constitute the entire agreement between you and the
              Company regarding the Service and supersede all prior agreements,
              understandings, and representations.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Severability.</strong> If any provision of these Terms is
              found to be invalid, illegal, or unenforceable by a court of
              competent jurisdiction, the remaining provisions shall continue in
              full force and effect.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Waiver.</strong> The failure of the Company to enforce any
              right or provision of these Terms shall not constitute a waiver of
              such right or provision. Any waiver must be in writing and signed
              by an authorized representative of the Company.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>Assignment.</strong> You may not assign or transfer your
              rights or obligations under these Terms without the Company&apos;s
              prior written consent. The Company may assign its rights and
              obligations without restriction.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Force majeure.</strong> The Company shall not be liable
              for any failure or delay in performance resulting from causes
              beyond its reasonable control, including but not limited to acts
              of God, natural disasters, pandemics, government orders, civil
              unrest, labor disputes, or failures of third-party services.
            </p>
          </section>

          {/* 20 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              20. Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="rounded-lg bg-gray-50 p-5 text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">Tikvah Express LLC</p>
              <p>d/b/a Peak Drive Denver &bull; Peak Drive Rentals</p>
              <p>Denver, Colorado</p>
              <p className="pt-2">
                Legal:{" "}
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
              <p>
                Arbitration opt-out:{" "}
                <a
                  href="mailto:legal@peakdriverentals.com"
                  className="text-neutral-800 hover:underline"
                >
                  legal@peakdriverentals.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
