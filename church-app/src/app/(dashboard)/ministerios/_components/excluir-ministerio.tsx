"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { excluirMinisterio } from "../actions";
import { Button } from "@/components/ui/button";

export function ExcluirMinisterio({ id, nome }: { id: string; nome: string }) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Excluir o ministério "${nome}"?`)) return;
    startTransition(async () => {
      const result = await excluirMinisterio(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Ministério excluído.");
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
