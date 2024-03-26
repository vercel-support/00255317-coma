import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Ha ocurrido un error"
      backButtonHref="/auth/login"
      backButtonLabel="Volver al inicio"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="w-8 h-8 text-destructive" />
      </div>
    </CardWrapper>
  );
};
