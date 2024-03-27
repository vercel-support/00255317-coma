"use client";
import { Logo } from "@/components/custom ui/logo";
import { Button } from "@/components/ui/button";
import { MdDoNotDisturbAlt } from "react-icons/md";
export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full pt-10 gap-y-4 px-4">
        <Logo />
        <MdDoNotDisturbAlt className="h-20 w-20 text-red-500" />
        <p>Página no encontrada:</p>
        <h1 className="text-6xl font-extrabold">404</h1>
        <p className="text-3xl text-center">
          {" "}
          La página que buscas no existe.{" "}
        </p>
        <div className="flex items-center justify-between gap-x-6">
          <Button variant="default" onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
        <p className="text-center font-light ">
          Si el error persiste pongase en contacto con los desarrolladores del
          sitio web. Gracias.
        </p>
      </div>
    </>
  );
}
