"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { ButtonBack } from "./button-back";
import { FaChevronLeft } from "react-icons/fa";
import Image from "next/image";
interface Props {
  icon: React.ReactNode;
  title: string;
  titleBigDetail: React.ReactNode;
  titleBoxLeft: string;
  contentBoxLeft: React.ReactNode;
  titleBoxRight: string;
  contentBoxRight: React.ReactNode;
  back?: boolean;
}
const HeaderAdminBox = ({
  icon,
  title,
  titleBigDetail,
  titleBoxLeft,
  contentBoxLeft,
  titleBoxRight,
  contentBoxRight,
  back = false,
}: Props) => {
  return (
    <Card className="relative w-full max-h-40 p-4 flex  bg-branding overflow-y-auto customScroll overflow-x-hidden">
      <div
        className="absolute -top-0 -right-20 w-full h-[157px] bg-content bg-no-repeat bg-center opacity-[7%]"
        style={{ backgroundImage: "url('/logo-gesapp-white.svg')" }}
      ></div>
      <div className=" w-3 absolute top-0 left-0">
        {back && (
          <ButtonBack>
            <FaChevronLeft size={25} />
          </ButtonBack>
        )}
      </div>
      <div className="w-full flex flex-col justify-between">
        <div className="w-full h-full flex items-center gap-4 ml-6">
          {/* icon h-20 w-20 */}
          {icon}

          <div className="flex flex-col gap-0 items-start">
            <p className="text-sm text-left  text-white/80">
              {title.toUpperCase()}
            </p>
            <h1 className="text-white text-3xl font-black">{titleBigDetail}</h1>
          </div>
        </div>
        <div className="mt-2  md:mt-1 w-full flex items-start justify-between">
          <div className="w-1/2 md:ml-2">
            {titleBoxLeft && (
              <p className="text-sm text-left md:text-lg text-white/80">
                {titleBoxLeft.toLowerCase()}
              </p>
            )}

            {contentBoxLeft}
          </div>
          {contentBoxLeft && contentBoxRight && (
            <Separator orientation="vertical" className="bg-white  " />
          )}

          <span className="w-1/2 h-10 ml-2">
            {titleBoxRight && (
              <p className="text-sm text-left md:text-lg text-white/80">
                {titleBoxRight.toLowerCase()}
              </p>
            )}
            {contentBoxRight}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default HeaderAdminBox;

export const LoaderHeaderAdminBox = () => {
  return <Skeleton className="w-full h-40" />;
};
