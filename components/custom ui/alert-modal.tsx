"use client";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";

interface AlertModalI {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
  labelActionButton?: string;
  buttons?: boolean;
}
export const AlertModal: React.FC<AlertModalI> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  children,
  labelActionButton,
  buttons = true,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      {children}
      <div className="pt-6 space-x-2 flex max-md:flex-col items-center justify-end w-full gap-4">
        {buttons && (
          <>
            {" "}
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="max-md:w-full border-gray-500"
            >
              Cancelar
            </Button>
            <Button
              variant={"destructive"}
              onClick={onConfirm}
              disabled={loading}
              className="max-md:w-full"
            >
              {labelActionButton || "Eliminar"}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};
