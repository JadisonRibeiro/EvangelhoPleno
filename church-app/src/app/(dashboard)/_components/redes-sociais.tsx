"use client";

import { ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Rede = {
  nome: string;
  href: string;
  /** Glifo oficial da marca (Simple Icons). */
  path: string;
  /** Preenchimento do glifo: cor sólida ou url() de gradiente. */
  fill: string;
};

/** Gradiente oficial do Instagram, aplicado ao glifo via SVG defs. */
const GRADIENTE_INSTAGRAM = (
  <defs>
    <radialGradient id="grad-instagram" cx="30%" cy="107%" r="150%">
      <stop offset="0%" stopColor="#FDF497" />
      <stop offset="5%" stopColor="#FDF497" />
      <stop offset="45%" stopColor="#FD5949" />
      <stop offset="60%" stopColor="#D6249F" />
      <stop offset="90%" stopColor="#285AEB" />
    </radialGradient>
  </defs>
);

const REDES: Rede[] = [
  {
    nome: "Instagram",
    href: "https://www.instagram.com/evangelhoplenoparagominas?igsh=ZmZyYTZpYTRwcDk3",
    fill: "url(#grad-instagram)",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  },
  {
    nome: "YouTube",
    href: "https://youtube.com/@evangelhoplenoparagominas?si=L8Ud4yihg1EFLR-a",
    fill: "#FF0000",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

async function compartilhar(rede: Rede) {
  const dados = {
    title: `${rede.nome} — Evangelho Pleno`,
    url: rede.href,
  };
  if (navigator.share) {
    try {
      await navigator.share(dados);
    } catch {
      // Usuário cancelou o compartilhamento — nada a fazer.
    }
  } else {
    await navigator.clipboard.writeText(rede.href);
    toast.success("Link copiado para a área de transferência!");
  }
}

/**
 * Redes sociais da igreja com os logos oficiais em suas cores originais.
 * O clique abre um menu com as opções de abrir o perfil ou compartilhar
 * o link (Web Share API no celular; copia o link no desktop).
 */
export function RedesSociais() {
  return (
    <div className="flex items-center gap-1">
      {REDES.map((rede) => (
        <DropdownMenu key={rede.nome}>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label={`${rede.nome} da igreja`}
                title={rede.nome}
                className="flex size-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-5.5">
                  {rede.fill.startsWith("url(") && GRADIENTE_INSTAGRAM}
                  <path d={rede.path} fill={rede.fill} />
                </svg>
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.open(rede.href, "_blank", "noopener")}
            >
              <ExternalLink className="size-4" /> Abrir {rede.nome}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => compartilhar(rede)}>
              <Share2 className="size-4" /> Compartilhar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}
