import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { RegisterSW } from "@/components/register-sw";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evangelho Pleno",
  description: "Gestão de igreja em células",
  appleWebApp: {
    capable: true,
    title: "Pleno",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  // Viewport explícito: largura do aparelho, sem zoom inicial nem zoom
  // automático ao focar inputs (comportamento de app nativo no mobile).
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="top-center" />
          <RegisterSW />
        </ThemeProvider>
      </body>
    </html>
  );
}
