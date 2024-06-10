"use client";

import { cn } from "@/lib/utils";
/** Packages */

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { ButtonBack } from "@/components/custom ui/button-back";
import { FlexContainer } from "@/components/custom ui/flex-container";

export interface TitleAdminInterface {
  title: string;
  icon: JSX.Element;
  subtitle?: string;
  back?: boolean;
  url: string;
  className?: string;
}

export const TitleAdmin: React.FC<TitleAdminInterface> = ({
  title,
  icon,
  subtitle,
  back,
  url,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative font-bold text-2xl uppercase flex flex-col md:flex-row items-center gap-3 border-b border-neutral-300 pb-2 ",
        className
      )}
    >
      {back && (
        <ButtonBack className="hover:text-brandingThird absolute left-0 md:-left-12">
          <FaChevronLeft />
        </ButtonBack>
      )}
      <div className="text-neutral-500">{icon}</div>
      <FlexContainer row className="text-center">
        <Link href={url}> {title}</Link>{" "}
        {subtitle ? (
          <div className=" text-secundary ml-1">/{subtitle}</div>
        ) : (
          ""
        )}
      </FlexContainer>
    </div>
  );
};
