"use client";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

export const ErrorComponent = ({
  code,
  message,
}: {
  code: number;
  message: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-10 gap-y-4 px-4">
      <Logo />
      <AlertTriangle className="h-20 w-20 text-red-500" />
      <p>Ha ocurrido un error:</p>
      <h1 className="text-6xl font-extrabold">
        {code} {code && "!"}
      </h1>
      <p className="text-3xl text-center"> {message} </p>
      <div className="flex items-center justify-between gap-x-6">
        <Button variant="default" onClick={() => window.location.reload()}>
          Recargar
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Volver
        </Button>
      </div>
      <p className="text-center font-light ">
        Si el error persiste pongase en contacto con los desarrolladores del
        sitio web. Gracias.
      </p>
    </div>
  );
};
