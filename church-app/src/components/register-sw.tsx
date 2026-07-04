"use client";

import { useEffect } from "react";

/**
 * Registra o service worker apenas em produção. Em desenvolvimento o SW
 * causa cache de bundles/RSC desatualizados (erros como "frame.join is not a
 * function" após reiniciar o dev server), então aqui garantimos que qualquer
 * SW já instalado seja removido e os caches limpos.
 */
export function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
      if ("caches" in window) {
        caches
          .keys()
          .then((keys) => keys.forEach((k) => caches.delete(k)))
          .catch(() => {});
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // falha no registro do SW não deve quebrar o app
    });
  }, []);

  return null;
}
