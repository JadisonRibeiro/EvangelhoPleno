import Link from "next/link";
import { Home, LogOut } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { logout } from "../actions";

/**
 * Ações fixas presentes em toda tela: voltar à página inicial e sair do app.
 * Substitui a antiga topbar — sem faixa/identidade duplicada.
 */
export function AcoesTela({ inicio = true }: { inicio?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {inicio && (
        <Link
          href="/dashboard"
          aria-label="Página inicial"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <Home className="size-4" />
          <span className="hidden sm:inline">Início</span>
        </Link>
      )}
      <form action={logout}>
        <button
          type="submit"
          aria-label="Sair do app"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </form>
    </div>
  );
}
