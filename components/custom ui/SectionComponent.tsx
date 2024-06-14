"use client";

import { cn } from "@/lib/utils";
import ButtonNextSection from "./ButtonNextSection";
interface Props {
  title: string;
  sectionId: string;
  children: React.ReactNode;
  arrow?: "dark" | "light";
  nextSectionId?: string;
  description?: string;
  bgBrandingRadial?: boolean;
  className?: string;
}
const SectionComponent = ({
  title,
  sectionId,
  nextSectionId,
  children,
  description,
  bgBrandingRadial = false,
  className,
  arrow = "dark",
}: Props) => {
  return (
    <section
      id={sectionId}
      className={cn(
        "w-screen min-h-screen overflow-auto flex flex-col items-center justify-start pt-20 gap-6 pb-4",
        bgBrandingRadial &&
          "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brandingThird to-brandingSecond",
        className
      )}
    >
      <h1
        className={cn(
          "text-3xl md:text-5xl text-white font-bold text-center mb-2",
          arrow === "light" ? "text-white " : "text-primary"
        )}
      >
        {title}
      </h1>
      {description && <p className="w-1/2 text-center">{description}</p>}
      {children}
      {nextSectionId && (
        <ButtonNextSection
          sectionId={nextSectionId}
          className={arrow === "light" ? "text-white" : "text-primary"}
        />
      )}
    </section>
  );
};

export default SectionComponent;
