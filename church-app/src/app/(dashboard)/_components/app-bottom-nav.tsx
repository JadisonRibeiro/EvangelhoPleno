"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { MODULES, MINISTERIOS, PRIMARY } from "@/lib/nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function ehAtivo(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname.startsWith(href);
}

/**
 * Barra de navegação inferior — exclusiva do mobile.
 * Dá ao app a sensação de aplicativo nativo: 4 destinos primários + "Menu"
 * (que abre uma folha inferior com todos os módulos). Oculta em telas md+.
 */
export function AppBottomNav() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
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

        <Sheet open={aberto} onOpenChange={setAberto}>
          <SheetTrigger
            render={
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-1 py-2.5 text-[0.65rem] font-medium text-muted-foreground"
              >
                <Menu className="size-[1.35rem]" strokeWidth={1.8} />
                Menu
              </button>
            }
          />
          <SheetContent
            side="bottom"
            className="max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t pb-[calc(env(safe-area-inset-bottom)+1rem)]"
          >
            <SheetHeader className="p-4 pb-2">
              <SheetTitle>Navegação</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2 px-4">
              {[...MODULES, ...MINISTERIOS].map((m) => {
                const ativo = ehAtivo(pathname, m.href);
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    onClick={() => setAberto(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3.5 transition-colors active:scale-[0.98]",
                      ativo
                        ? "border-brand/40 bg-brand/5"
                        : "border-border bg-card hover:bg-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl",
                        ativo
                          ? "bg-brand text-brand-foreground"
                          : "bg-secondary text-foreground",
                      )}
                    >
                      <m.icon className="size-[1.15rem]" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {m.label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {m.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
