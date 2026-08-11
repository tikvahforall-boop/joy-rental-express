import Link from "next/link";
import { Car } from "lucide-react";

const FOOTER_LINKS = {
  Company: [
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How it Works" },
    { href: "/contact", label: "Contact" },
  ],
  Hosts: [
    { href: "/become-a-host", label: "Become a Host" },
    { href: "/protection", label: "Protection Plans" },
    { href: "/driver-requirements", label: "Driver Requirements" },
  ],
  Support: [
    { href: "/help", label: "Help Center" },
    { href: "/cancellation-policy", label: "Cancellation Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-neutral-400" />
              <span className="text-lg font-bold">Mile High Car Rental</span>
            </Link>
            <p className="mt-3 text-sm text-neutral-200">
              Find and rent the perfect car from trusted hosts or our own fleet.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-300">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-200 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-black pt-8 sm:flex-row">
          <p className="text-sm text-neutral-300">
            &copy; {new Date().getFullYear()} Mile High Car Rental. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <SocialPlaceholder label="Facebook" />
            <SocialPlaceholder label="Twitter" />
            <SocialPlaceholder label="Instagram" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialPlaceholder({ label }: { label: string }) {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs text-neutral-300 transition-colors hover:bg-neutral-900"
      title={label}
    >
      {label[0]}
    </span>
  );
}
