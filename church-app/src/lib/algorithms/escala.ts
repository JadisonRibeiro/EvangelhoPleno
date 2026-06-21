// Algoritmo de geração de escalas mensais (spec 6.3).
// - Casais sempre escalados juntos (contam como 2 pessoas)
// - Distribuição balanceada: todos servem um número parecido de vezes
// - Evita a mesma unidade em datas consecutivas

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const DIAS_SEMANA = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

/** Uma "unidade" escalável: um indivíduo (size 1) ou um casal (size 2). */
export interface UnidadeEscala {
  key: string;
  profileIds: string[];
  label: string;
  isCouple: boolean;
  size: number;
}

export interface EntradaEscala {
  date: string; // ISO yyyy-mm-dd
  unidades: UnidadeEscala[];
}

export interface MembroBruto {
  profile_id: string;
  full_name: string;
  is_couple_pair: boolean;
  couple_partner_id: string | null;
  partner_name: string | null;
}

/** Converte os membros do ministério em unidades, deduplicando casais. */
export function construirUnidades(membros: MembroBruto[]): UnidadeEscala[] {
  const unidades: UnidadeEscala[] = [];
  const emCasal = new Set<string>();
  const casaisVistos = new Set<string>();

  // 1) casais primeiro (para marcar quem já está em casal)
  for (const m of membros) {
    if (m.is_couple_pair && m.couple_partner_id) {
      const par = [m.profile_id, m.couple_partner_id].sort();
      const key = par.join("+");
      if (casaisVistos.has(key)) continue;
      casaisVistos.add(key);
      emCasal.add(m.profile_id);
      emCasal.add(m.couple_partner_id);
      const parceiro = m.partner_name ?? "Parceiro(a)";
      unidades.push({
        key,
        profileIds: [m.profile_id, m.couple_partner_id],
        label: `${m.full_name} & ${parceiro}`,
        isCouple: true,
        size: 2,
      });
    }
  }

  // 2) indivíduos que não estão em nenhum casal
  for (const m of membros) {
    if (emCasal.has(m.profile_id)) continue;
    if (m.is_couple_pair && m.couple_partner_id) continue;
    unidades.push({
      key: m.profile_id,
      profileIds: [m.profile_id],
      label: m.full_name,
      isCouple: false,
      size: 1,
    });
  }

  return unidades;
}

/** Todas as datas de um dia da semana (0=Dom..6=Sáb) em um mês. */
export function datasDoMesPorDiaSemana(
  year: number,
  month: number, // 1-12
  weekday: number, // 0-6
): string[] {
  const datas: string[] = [];
  const diasNoMes = new Date(year, month, 0).getDate();
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const d = new Date(Date.UTC(year, month - 1, dia));
    if (d.getUTCDay() === weekday) {
      const mm = String(month).padStart(2, "0");
      const dd = String(dia).padStart(2, "0");
      datas.push(`${year}-${mm}-${dd}`);
    }
  }
  return datas;
}

/** Gera a escala distribuindo as unidades de forma balanceada. */
export function gerarEscalaMensal(
  unidades: UnidadeEscala[],
  datas: string[],
  minPorData = 2,
): EntradaEscala[] {
  if (unidades.length === 0) {
    return datas.map((date) => ({ date, unidades: [] }));
  }

  const vezes = new Map<string, number>(unidades.map((u) => [u.key, 0]));
  const ultimaDataIdx = new Map<string, number>();
  const resultado: EntradaEscala[] = [];

  for (let i = 0; i < datas.length; i++) {
    const escolhidas: UnidadeEscala[] = [];
    const usadas = new Set<string>();
    let pessoas = 0;

    while (pessoas < minPorData) {
      const disponiveis = unidades.filter((u) => !usadas.has(u.key));
      if (disponiveis.length === 0) break;

      // prioriza quem serviu menos e não esteve na data anterior
      const naoConsecutivas = disponiveis.filter(
        (u) => ultimaDataIdx.get(u.key) !== i - 1,
      );
      const pool = naoConsecutivas.length > 0 ? naoConsecutivas : disponiveis;
      pool.sort((a, b) => (vezes.get(a.key) ?? 0) - (vezes.get(b.key) ?? 0));

      const u = pool[0];
      escolhidas.push(u);
      usadas.add(u.key);
      ultimaDataIdx.set(u.key, i);
      vezes.set(u.key, (vezes.get(u.key) ?? 0) + 1);
      pessoas += u.size;
    }

    resultado.push({ date: datas[i], unidades: escolhidas });
  }

  return resultado;
}
