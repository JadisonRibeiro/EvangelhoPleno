"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Church,
  ClipboardList,
  HeartHandshake,
  CalendarDays,
  GraduationCap,
  Heart,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ROLE_LABELS, type Role } from "@/lib/types";
import { logout } from "../actions";

const grupos: {
  label: string | null;
  itens: { href: string; label: string; icon: typeof Users }[];
}[] = [
  {
    label: null,
    itens: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Gestão",
    itens: [
      { href: "/membros", label: "Membros", icon: Users },
      { href: "/celulas", label: "Células", icon: Church },
      { href: "/relatorios", label: "Relatórios", icon: ClipboardList },
      { href: "/ministerios", label: "Ministérios", icon: HeartHandshake },
      { href: "/escalas", label: "Escalas", icon: CalendarDays },
      { href: "/discipulado", label: "Discipulado", icon: GraduationCap },
    ],
  },
  {
    label: "Pastoral",
    itens: [{ href: "/amar", label: "AMAR", icon: Heart }],
  },
];

export function AppSidebar({ nome, role }: { nome: string; role: Role }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const iniciais =
    nome
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-12 items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Logo className="group-data-[collapsible=icon]:hidden" />
          <Church className="hidden size-5 text-brand group-data-[collapsible=icon]:block" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {grupos.map((g, i) => (
          <SidebarGroup key={i}>
            {g.label && <SidebarGroupLabel>{g.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {g.itens.map((it) => (
                <SidebarMenuItem key={it.href}>
                  <SidebarMenuButton
                    isActive={isActive(it.href)}
                    tooltip={it.label}
                    render={<Link href={it.href} />}
                  >
                    <it.icon />
                    <span>{it.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 rounded-md p-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Avatar className="size-8 shrink-0 rounded-md">
            <AvatarFallback className="rounded-md bg-brand text-xs font-medium text-brand-foreground">
              {iniciais}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">{nome}</span>
            <span className="truncate text-xs text-muted-foreground">
              {ROLE_LABELS[role]}
            </span>
          </div>
          <form
            action={logout}
            className="group-data-[collapsible=icon]:hidden"
          >
            <Button type="submit" variant="ghost" size="icon" aria-label="Sair">
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
