"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { excluirAmar } from "../actions";
import { Button } from "@/components/ui/button";

export function ExcluirAmar({ id, nome }: { id: string; nome: string }) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Excluir o registro de "${nome}"?`)) return;
    startTransition(async () => {
      const result = await excluirAmar(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Registro excluído.");
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={onClick}
      disabled={isPending}
    >
      Excluir
    </Button>
  );
}
