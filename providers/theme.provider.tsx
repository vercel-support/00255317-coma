/**
 * Componente ThemeProvider
 *
 * Componente de React que actúa como un proveedor de temas utilizando Next.js Themes.
 *
 * @component
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que se beneficiarán del proveedor de temas.
 * @param {object} props - Resto de las propiedades que se pasan al proveedor de temas de Next.js.
 * @returns {React.ReactNode} - Componente ThemeProvider que envuelve a sus hijos con el proveedor de temas.
 */
"use client";

// Importar las dependencias necesarias
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
