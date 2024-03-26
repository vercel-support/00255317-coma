"use client";

import { BeatLoader } from "react-spinners";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { Formsuccess } from "@/components/custom ui/form-success";
import { FormError } from "@/components/custom ui/form-error";

export const NewVerificationForm = () => {
  const [error, seterror] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      seterror("Token extraviado");
      return;
    }
    newVerification(token)
      .then((data) => {
        seterror(data?.error);
        setSuccess(data?.success);
      })
      .catch(() => {
        seterror("Ha ocurrido un error");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Verificación de email"
      backButtonLabel="Iniciar sesión"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <Formsuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
