/**
 * Fundo premium compartilhado pelo login e pela tela de boas-vindas.
 * Gradiente preto → cinza escuro com luzes suaves, reflexo metálico
 * diagonal e vinheta — usando apenas a paleta monocromática aprovada
 * (#000000, #FFFFFF, #1E1E1E, #2E2E2E, #4A4A4A, #6E6E6E).
 */
export function FundoPremium() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Gradiente base — profundidade vertical */}
      <div className="absolute inset-0 bg-linear-to-b from-[#1E1E1E] via-black to-black" />

      {/* Luz principal — foco suave vindo de cima */}
      <div className="absolute left-1/2 top-0 size-136 max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

      {/* Reflexo metálico diagonal (efeito espelhado sutil) */}
      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/4 to-transparent" />

      {/* Brilhos laterais discretos em cinza */}
      <div className="absolute -left-32 bottom-1/4 h-80 w-80 rounded-full bg-[#4A4A4A]/25 blur-3xl" />
      <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-[#2E2E2E]/40 blur-3xl" />

      {/* Linha de reflexo no horizonte superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />

      {/* Vinheta — escurece as bordas e concentra o olhar no centro */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  );
}
