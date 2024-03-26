"use client";

// Importar las dependencias necesarias
import { cn } from "@/lib/utils";

export interface FlexContainerInterface {
  children: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  row?: boolean;
  start?: boolean;
  center?: boolean;
  end?: boolean;
  between?: boolean;
  fullHeight?: boolean;
}

export const FlexContainer: React.FC<FlexContainerInterface> = ({
  children,
  className,
  row,
  start,
  center,
  end,
  between,
  fullHeight,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col",
        start && "justify-start",
        center && "justify-center",
        end && "justify-end",
        between && "justify-between",
        row ? "md:flex-row" : "", // Aplicar clase para distribución en fila si row es true
        fullHeight ? "h-screen" : "", // Aplicar clase para altura completa si fullHeight es true
        className
      )}
    >
      {children}
    </div>
  );
};
