import "@/app/globals.css";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "@/providers/scroll-to-top.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Lato } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "C.O.M.A",
  description: "Centro de Orientación Matrimonial Asistida",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="es">
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/<generated>"
          sizes="<generated>"
        />
        <body className={lato.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            storageKey="comoa-theme"
          >
            <NextTopLoader color="#e06287" showSpinner={false} />
            <Toaster />
            <ScrollToTop>{children}</ScrollToTop>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
