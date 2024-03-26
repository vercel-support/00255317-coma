"use client";
import { ErrorComponent } from "@/components/custom ui/error-component";
import { CustomError } from "@/lib/custom-error.class";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: CustomError & { digest?: string };
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html>
      <body>
        <ErrorComponent code={error.code} message={error.message} />
      </body>
    </html>
  );
}
