"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { excluirMembro } from "../actions";
import { Button } from "@/components/ui/button";

export function ExcluirMembro({ id, nome }: { id: string; nome: string }) {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Excluir o membro "${nome}"?`)) return;
    startTransition(async () => {
      const result = await excluirMembro(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Membro excluído.");
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
