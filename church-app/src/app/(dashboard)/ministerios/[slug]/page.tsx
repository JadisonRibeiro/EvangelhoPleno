import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";

import { MINISTERIOS } from "@/lib/nav";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

/**
 * Página de apresentação de um ministério ainda sem gestão própria.
 * "Amar" já tem fluxo completo (rota /amar); os demais exibem uma tela
 * elegante de "em breve" com a identidade do ministério.
 */
export default async function MinisterioSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ministerio = MINISTERIOS.find(
    (m) => m.href === `/ministerios/${slug}`,
  );
  if (!ministerio) notFound();

  const Icon = ministerio.icon;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title={ministerio.label}
        description={ministerio.description}
        backHref="/ministerios"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Ministérios", href: "/ministerios" },
          { label: ministerio.label },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl border ring-1 ring-foreground/5">
        {ministerio.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ministerio.image}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />

        <div className="relative flex flex-col items-center gap-4 px-6 py-16 text-center sm:py-20">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground ring-1 ring-foreground/10">
            <Icon className="size-7" strokeWidth={1.6} />
          </span>
          <div className="space-y-1.5">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="size-3" /> Em breve
            </Badge>
            <h2 className="text-xl font-semibold tracking-tight">
              Ministério {ministerio.label}
            </h2>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              A gestão deste ministério está sendo preparada. Em breve você
              poderá acompanhar equipes, membros e atividades por aqui.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
