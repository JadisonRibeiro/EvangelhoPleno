import { AppBottomNav } from "./_components/app-bottom-nav";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="pb-safe-nav flex-1">
        <div className="app-container">{children}</div>
      </main>
      <AppBottomNav />
    </div>
  );
}
