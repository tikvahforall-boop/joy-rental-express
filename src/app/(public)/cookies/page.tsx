import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Mile High Car Rental",
  description:
    "Learn about how Mile High Car Rental uses cookies and similar technologies.",
};

const cookieTypes = [
  {
    name: "Strictly Necessary Cookies",
    description:
      "These cookies are essential for the website to function and cannot be disabled. They are set in response to actions you take such as logging in, setting privacy preferences, or filling in forms. Without these cookies, certain features of the Service cannot be provided.",
    examples: "Session management, authentication, CSRF protection, load balancing",
    canDisable: false,
  },
  {
    name: "Performance & Analytics Cookies",
    description:
      "These cookies help us understand how visitors interact with the Service by collecting information about pages visited, time spent, errors encountered, and traffic sources. All data is aggregated and anonymous. We use this data to improve how the Service works.",
    examples: "Google Analytics, page load time tracking, error monitoring",
    canDisable: true,
  },
  {
    name: "Functional & Preference Cookies",
    description:
      "These cookies allow the Service to remember choices you have made, such as your preferred language, region, currency display, and search filters. They provide enhanced, personalized features and are not used for tracking across other websites.",
    examples: "Language preference, saved search filters, theme preference",
    canDisable: true,
  },
  {
    name: "Marketing & Advertising Cookies",
    description:
      "These cookies are used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. They may be set by our advertising partners and used to build a profile of your interests. If you do not allow these cookies, you will still see ads, but they will be less relevant.",
    examples: "Retargeting campaigns, ad conversion tracking, social media pixels",
    canDisable: true,
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Cookie Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Last updated: [EFFECTIVE DATE]
        </p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What Are Cookies?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files that are stored on your device when
              you visit a website. They are widely used to make websites work
              efficiently, provide a better user experience, and give website
              owners usage information. [COMPANY LEGAL NAME] ("Joy Rental
              Express") uses cookies and similar technologies (such as web
              beacons, pixels, and local storage) on our website and
              application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              {cookieTypes.map((cookie) => (
                <div
                  key={cookie.name}
                  className="border border-gray-200 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cookie.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        cookie.canDisable
                          ? "bg-gray-100 text-gray-600"
                          : "bg-neutral-50 text-neutral-900"
                      }`}
                    >
                      {cookie.canDisable ? "Optional" : "Required"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {cookie.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-medium">Examples:</span>{" "}
                    {cookie.examples}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Third-Party Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Some cookies are placed by third-party services that appear on
              our pages. We use third-party cookies for payment processing
              (Stripe), analytics (Google Analytics), fraud detection, and
              customer support tools. These third parties have their own privacy
              policies governing the use of their cookies. We do not control
              the information collected by third-party cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              How to Manage Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You can control and manage cookies in several ways. Most web
              browsers allow you to manage cookie preferences through their
              settings. You can set your browser to refuse cookies, delete
              existing cookies, or alert you when a cookie is being set.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              Please note that disabling or deleting cookies may affect the
              functionality of the Service. Strictly necessary cookies cannot
              be disabled as they are essential for the website to operate.
            </p>
            <p className="text-gray-600 leading-relaxed">
              For more information about managing cookies in your browser,
              visit the help section of your browser or refer to{" "}
              <span className="text-gray-800 font-medium">
                aboutcookies.org
              </span>{" "}
              for general guidance. To opt out of Google Analytics tracking
              across all websites, you can install the Google Analytics Opt-Out
              Browser Add-on.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Cookie Retention
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Session cookies are deleted when you close your browser.
              Persistent cookies remain on your device for a set period or
              until you manually delete them. The retention period for each
              cookie depends on its purpose: authentication cookies typically
              expire after 30 days of inactivity, preference cookies are
              retained for up to 1 year, and analytics cookies are retained for
              up to 26 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Updates to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in the cookies we use or for operational, legal, or
              regulatory reasons. Please revisit this page periodically to
              stay informed about our use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about our use of cookies, please contact us
              at{" "}
              <a
                href="mailto:privacy@milehighcars.com"
                className="text-neutral-800 hover:underline"
              >
                privacy@milehighcars.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
