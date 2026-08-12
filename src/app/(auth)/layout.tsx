import Link from "next/link";
import { Car } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Car className="h-8 w-8 text-neutral-800" />
        <span className="text-2xl font-bold text-gray-900">
          Peak Drive Denver
        </span>
      </Link>
      {children}
    </div>
  );
}
