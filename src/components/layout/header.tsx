"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Car,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/search", label: "Search Cars" },
  { href: "/book", label: "Book Online" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/become-a-host", label: "Become a Host" },
];

function AnimatedLogo() {
  const [phase, setPhase] = useState<"idle" | "drive-out" | "drive-back">("idle");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("drive-out"), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "drive-out") {
      const t = setTimeout(() => setPhase("drive-back"), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "drive-back") {
      const t = setTimeout(() => setPhase("idle"), 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "idle") {
      const t = setTimeout(() => setPhase("drive-out"), 8000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <Link href="/" className="relative flex items-center gap-2" style={{ minWidth: 250 }}>
      <span
        className="absolute left-0 inline-flex shrink-0"
        style={{
          transition: "transform 0.8s",
          transform:
            phase === "drive-out"
              ? "translateX(230px)"
              : "translateX(0px)",
          transitionTimingFunction:
            phase === "drive-out"
              ? "cubic-bezier(0.4, 0, 0.2, 1)"
              : "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <Car
          className="h-7 w-7 text-neutral-800"
          style={{
            animation:
              phase === "drive-out" || phase === "drive-back"
                ? "carBounce 0.12s ease-in-out infinite"
                : "none",
          }}
        />
      </span>
      <span
        className="ml-9 text-lg font-bold text-gray-900 whitespace-nowrap"
        style={{
          transition: "opacity 0.4s, transform 0.5s",
          opacity: phase === "drive-out" ? 0 : 1,
          transform:
            phase === "drive-out"
              ? "translateY(8px) scale(0.95)"
              : "translateY(0) scale(1)",
          transitionDelay: phase === "drive-back" ? "0.4s" : "0s",
        }}
      >
        Mile High Car Rental
      </span>
    </Link>
  );
}

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <AnimatedLogo />

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" && (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-100" />
          )}
          {status === "unauthenticated" && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
          {status === "authenticated" && session?.user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-white">
                    {getInitials(session.user.name || session.user.email || "U")}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <DropdownLink
                        href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                        icon={LayoutDashboard}
                        label="Dashboard"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <DropdownLink
                        href="/dashboard/bookings"
                        icon={MapPin}
                        label="My Trips"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <DropdownLink
                        href="/dashboard/messages"
                        icon={MessageSquare}
                        label="Messages"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <DropdownLink
                        href="/dashboard/settings"
                        icon={Settings}
                        label="Settings"
                        onClick={() => setDropdownOpen(false)}
                      />
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-3">
            {status === "unauthenticated" && (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
            {status === "authenticated" && session?.user && (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/bookings"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  My Trips
                </Link>
                <Link
                  href="/dashboard/messages"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Messages
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function DropdownLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
