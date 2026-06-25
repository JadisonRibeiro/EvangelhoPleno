"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { MODULES, secaoAtual } from "@/lib/nav";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "../actions";

export function AppTopbar({ nome, role }: { nome: string; role: Role }) {
  const pathname = usePathname();
  const secao = secaoAtual(pathname);

  const iniciais =
    nome
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur-xl">
      <div className="app-container flex h-14 items-center gap-1 px-4 sm:h-16 sm:px-6">
        {/* Logo + breadcrumb de seção */}
        <Link
          href="/dashboard"
          className="shrink-0 rounded-md transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>
        {secao && (
          <div className="flex min-w-0 items-center">
            <ChevronRight className="mx-1 size-4 shrink-0 text-muted-foreground/50" />
            <span className="truncate text-sm font-medium">{secao.label}</span>
          </div>
        )}

        {/* Direita: menu de módulos (desktop) + tema + usuário */}
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden h-9 gap-2 md:inline-flex"
                >
                  <LayoutGrid className="size-4" />
                  <span>Módulos</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" sideOffset={8} className="w-72 p-2">
              <DropdownMenuLabel className="px-2 pb-1.5">
                Navegar
              </DropdownMenuLabel>
              <div className="grid grid-cols-2 gap-1">
                {MODULES.map((m) => {
                  const ativo = pathname.startsWith(m.href);
                  return (
                    <DropdownMenuItem
                      key={m.href}
                      className={cn(
                        "flex-col items-start gap-1 rounded-lg p-2.5",
                        ativo && "bg-accent",
                      )}
                      render={<Link href={m.href} />}
                    >
                      <m.icon className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="h-11 gap-2 px-1.5 sm:px-2">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-secondary text-xs font-medium">
                      {iniciais}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left leading-tight sm:block">
                    <p className="text-sm font-medium">{nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {ROLE_LABELS[role]}
                    </p>
                  </div>
                </Button>
              }
            />
            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
                <span className="text-sm font-medium text-foreground">
                  {nome}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {ROLE_LABELS[role]}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  <LogOut className="size-4" /> Sair
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
