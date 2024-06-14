import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
interface Props {
  w: string;
  h: string;
}
const WindowComponent = () => {
  return (
    <div className="relative w-[250px] h-[250px] bg-brandingThird  rounded-t-full border-8 border-white overflow-visible shadow-2xl">
      <div className="absolute top-[-164px] left-[-218px] w-[600px] h-[600px]">
        <Image
          src="/pareja.png"
          width={800}
          height={800}
          alt="pareja"
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default WindowComponent;
