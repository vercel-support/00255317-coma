"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ButtonBack({ children, className }: Props) {
  const router = useRouter();

  return (
    <Button
      variant={"ghost"}
      className={className}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
}
