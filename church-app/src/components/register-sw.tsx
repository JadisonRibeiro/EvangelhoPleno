"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // falha no registro do SW não deve quebrar o app
      });
    }
  }, []);
  return null;
}
