import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gesapp",
  description: "Acceso.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <link
          rel="icon"
          href="/favicon.png"
          type="image/<generated>"
          sizes="<generated>"
        />
        <body className={nunito.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
