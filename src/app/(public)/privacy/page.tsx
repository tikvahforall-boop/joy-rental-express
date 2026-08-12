import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Peak Drive Rentals",
  description:
    "Learn how Peak Drive Rentals collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: [EFFECTIVE DATE]
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              [COMPANY LEGAL NAME] ("Peak Drive Rentals," "we," "us") collects
              information you provide directly, including your name, email
              address, phone number, date of birth, driver's license details,
              payment information, and profile data. When you list a vehicle, we
              collect vehicle details, registration documents, and location
              information.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We automatically collect usage data such as IP address, browser
              type, device information, pages visited, referring URLs, and
              interaction data through cookies and similar technologies. We may
              also collect location data when you use our mobile application
              with your consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>Process bookings, payments, and refunds</li>
              <li>Verify your identity and driver's license</li>
              <li>Facilitate communication between hosts and renters</li>
              <li>Provide customer support and resolve disputes</li>
              <li>Send transactional notifications about your trips</li>
              <li>Improve and personalize our Service</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Comply with legal obligations and enforce our Terms</li>
              <li>
                Send marketing communications (with your consent, where
                required)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Information Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We share your information with other users as necessary to
              facilitate bookings (e.g., your name and photo with a host). We
              share data with service providers who assist in payment
              processing, identity verification, insurance, analytics, and
              customer support.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We may disclose information when required by law, court order, or
              government request, or when we believe disclosure is necessary to
              protect rights, safety, or property. In the event of a merger,
              acquisition, or sale of assets, your information may be
              transferred to the successor entity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies, web beacons, and similar technologies to operate
              and improve the Service, remember your preferences, analyze
              usage patterns, and deliver relevant content. You can manage
              cookie preferences through your browser settings or our Cookie
              Preference Center. For detailed information, see our Cookie
              Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures including
              encryption in transit (TLS/SSL), encryption at rest, access
              controls, and regular security audits to protect your personal
              information. Payment data is processed by PCI-DSS compliant
              partners and is never stored on our servers. Despite these
              measures, no method of electronic transmission or storage is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Children's Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Service is not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children
              under 18. If we learn that we have collected information from a
              child under 18, we will promptly delete that information. If you
              believe a child has provided us with personal information, please
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Your Rights — California / CCPA
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you are a California resident, you have the right to know what
              personal information we collect, disclose, or sell; the right to
              request deletion of your personal information; the right to
              opt-out of the sale of your personal information (we do not sell
              personal information); and the right to non-discrimination for
              exercising your privacy rights. To submit a request, email us at{" "}
              <a
                href="mailto:privacy@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                privacy@peakdriverentals.com
              </a>{" "}
              or call our toll-free number. We will verify your identity before
              processing any request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Your Rights — GDPR (European Users)
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you are located in the European Economic Area (EEA), United
              Kingdom, or Switzerland, you have additional rights under the
              General Data Protection Regulation (GDPR), including the right of
              access, rectification, erasure, restriction of processing, data
              portability, and the right to object to processing.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our legal bases for processing include performance of a contract,
              legitimate interests, compliance with legal obligations, and your
              consent. You have the right to withdraw consent at any time. To
              exercise your rights, contact our Data Protection Officer at{" "}
              <a
                href="mailto:dpo@peakdriverentals.com"
                className="text-neutral-800 hover:underline"
              >
                dpo@peakdriverentals.com
              </a>
              . You also have the right to lodge a complaint with your local
              supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Data Retention and Contact
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We retain your personal information for as long as your account is active or as needed to provide the Service. After account deletion, we retain certain information for up to 7 years as required for legal, tax, and compliance purposes. Anonymized and aggregated data may be retained indefinitely for analytical purposes.
            </p>
            <p className="text-gray-600 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at{" "}
              <a href="mailto:privacy@peakdriverentals.com" className="text-neutral-800 hover:underline">privacy@peakdriverentals.com</a>{" "}
              or write to: [COMPANY LEGAL NAME], Attn: Privacy Team, at our registered business address.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
