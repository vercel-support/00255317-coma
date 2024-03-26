"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, useEffect, useState } from "react";
import { ScrollArea } from "./scroll-area";

interface ModalI {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: FC<ModalI> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  const onchange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onchange}>
      <DialogContent className="w-screen max-h-screen min-h-fit md:w-1/2 ">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-fit w-full customScroll">
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
