import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driver Requirements | Peak Drive Rentals",
  description:
    "Review the driver eligibility requirements for renting a vehicle on Peak Drive Rentals.",
};

export default function DriverRequirementsPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Driver Requirements
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: [EFFECTIVE DATE]
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Age Requirements
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              All renters must be at least 21 years of age at the time of
              pickup. Drivers between 21 and 24 years old may rent most
              vehicles but are subject to a young driver surcharge of $15-$30
              per day, depending on the vehicle category.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Renters must be at least 25 years old to book vehicles in the
              luxury, sports, and premium categories. There is no maximum age
              limit, but all drivers must hold a valid, unexpired driver's
              license.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Valid Driver's License
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You must hold a valid, government-issued driver's license that is
              not expired, suspended, or revoked. Your license must be valid for
              the class of vehicle you intend to rent. Learner's permits,
              temporary permits, and restricted licenses are not accepted.
            </p>
            <p className="text-gray-600 leading-relaxed">
              During the verification process, you will be asked to upload
              clear photos of the front and back of your driver's license. The
              name on your license must match the name on your Joy Rental
              Express account. License verification is typically completed
              within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Driving Record
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Peak Drive Rentals may check your driving record as part of the
              verification process. We use this information solely to assess
              rental eligibility and ensure platform safety. You may be
              ineligible to rent if your record includes:
            </p>
            <ul className="text-gray-600 space-y-2 list-disc pl-5 mb-3">
              <li>
                A DUI, DWI, or other alcohol/drug-related driving offense
                within the past 7 years
              </li>
              <li>
                A license suspension or revocation within the past 3 years
              </li>
              <li>
                Three or more moving violations within the past 3 years
              </li>
              <li>
                Any at-fault accident resulting in serious injury or fatality
              </li>
              <li>
                A hit-and-run conviction
              </li>
              <li>
                Reckless or dangerous driving convictions within the past 5
                years
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              If your record does not meet our criteria, we will notify you by
              email. You may appeal by providing additional context or
              documentation to our verification team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              International Renters
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              International visitors are welcome to rent on Peak Drive Rentals.
              If your driver's license is not issued in the United States, you
              must meet the following requirements:
            </p>
            <ul className="text-gray-600 space-y-2 list-disc pl-5 mb-3">
              <li>
                A valid driver's license from your country of residence
              </li>
              <li>
                An International Driving Permit (IDP) if your license is not in
                English (the IDP must accompany your original license)
              </li>
              <li>A valid passport for identity verification</li>
              <li>
                A credit card in your name for payment (debit cards may not be
                accepted for international renters)
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Licenses from all countries are accepted provided they are valid,
              current, and the IDP requirement (when applicable) is met.
              International renters are subject to the same age requirements
              and driving record standards as domestic renters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Additional Drivers
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Only registered and approved drivers may operate a rented
              vehicle. If you plan to have an additional driver, they must
              create a Peak Drive Rentals account, meet all driver requirements,
              complete the license verification process, and be added to the
              booking before the trip begins. An additional driver fee may
              apply. Allowing an unregistered driver to operate the vehicle
              voids all protection coverage and may result in account
              suspension.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Insurance and Protection
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All rentals include minimum liability coverage as required by
              state law. Additional protection plans are available at the time
              of booking. If you have personal auto insurance or coverage
              through your credit card, it may provide supplemental coverage.
              Check with your provider for details. Regardless of outside
              coverage, all drivers must select at least the Basic Protection
              tier when booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Verification Process
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Before your first rental, you will need to complete our
              verification process: upload your driver's license (front and
              back), provide a selfie for identity matching, and consent to a
              driving record check. Verification is a one-time process and is
              typically completed within 24 hours. You will receive an email
              notification once your verification is approved. You can check
              your verification status at any time from your account dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Questions?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about driver eligibility or the
              verification process, contact our support team at{" "}
              <a
                href="mailto:support@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                support@peakdriverentals.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
