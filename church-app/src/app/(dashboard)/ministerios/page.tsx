import { MINISTERIOS } from "@/lib/nav";
import { PageHeader } from "@/components/page-header";
import { ModuleCard } from "@/components/module-card";

export default function MinisteriosPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Ministérios"
        description="Equipes e frentes de serviço da igreja"
        breadcrumb={[
          { label: "Início", href: "/dashboard" },
          { label: "Ministérios" },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
        {MINISTERIOS.map((m) => (
          <ModuleCard
            key={m.href}
            href={m.href}
            label={m.label}
            description={m.description}
            image={m.image}
            icon={m.icon}
          />
        ))}
      </div>
    </div>
  );
}
