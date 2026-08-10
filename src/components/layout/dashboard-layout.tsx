import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role={role} />
      <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
