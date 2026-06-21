"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { excluirCelula } from "../actions";
import { Button } from "@/components/ui/button";

export function ExcluirCelula({ id, nome }: { id: string; nome: string }) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Excluir a célula "${nome}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    startTransition(async () => {
      const result = await excluirCelula(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Célula excluída.");
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
