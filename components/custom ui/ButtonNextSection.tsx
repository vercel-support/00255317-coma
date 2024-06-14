"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface Props {
  sectionId: string;
  className?: string;
}
const ButtonNextSection = ({ sectionId, className }: Props) => {
  const handleNextSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={() => handleNextSectionClick(sectionId)}
      className={cn("text-white font-black", className)}
    >
      <ChevronDown size={32} />
    </Button>
  );
};

export default ButtonNextSection;
