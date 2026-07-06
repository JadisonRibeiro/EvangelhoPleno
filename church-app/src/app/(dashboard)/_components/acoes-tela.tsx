import Link from "next/link";
import { Home, LogOut } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { logout } from "../actions";

/**
 * Ações fixas presentes em toda tela: voltar à página inicial e sair do app.
 * O rótulo "Início" fica sempre visível — nenhuma tela pode ficar sem um
 * caminho claro de volta à tela principal.
 */
export function AcoesTela({ inicio = true }: { inicio?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {inicio && (
        <Link
          href="/dashboard"
          aria-label="Voltar para a tela principal"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <Home className="size-4" />
          Início
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
