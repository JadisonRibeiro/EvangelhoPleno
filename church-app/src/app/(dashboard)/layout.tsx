import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "./actions";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/membros", label: "Membros" },
  { href: "/celulas", label: "Células" },
  { href: "/relatorios", label: "Relatórios" },
  { href: "/ministerios", label: "Ministérios" },
  { href: "/escalas", label: "Escalas" },
  { href: "/discipulado", label: "Discipulado" },
  { href: "/amar", label: "AMAR" },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout}>
          <Button type="submit" variant="outline" size="sm">
            Sair
          </Button>
        </form>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
