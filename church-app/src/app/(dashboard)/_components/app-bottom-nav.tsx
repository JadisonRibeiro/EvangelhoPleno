"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { PRIMARY } from "@/lib/nav";

function ehAtivo(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname.startsWith(href);
}

/**
 * Barra de navegação inferior — exclusiva do mobile.
 * Quatro destinos primários (Início, Membros, Células, Relatórios);
 * os demais módulos são acessados pelos botões da Home. Oculta em md+.
 */
export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {PRIMARY.map((item) => {
          const ativo = ehAtivo(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[0.65rem] font-medium transition-colors",
                ativo ? "text-brand" : "text-muted-foreground",
              )}
            >
              <item.icon
                className="size-[1.35rem]"
                strokeWidth={ativo ? 2.2 : 1.8}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
