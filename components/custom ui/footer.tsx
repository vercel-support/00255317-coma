import Link from "next/link";
import React from "react";
import { Logo } from "./logo";
import { MenuFooterItems } from "@/lib/constants";
import { PublicRoute } from "@/lib/routes";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full h-full flex max-md:flex-col items-center justify-between p-8 bg-branding">
      <Link
        href={PublicRoute.HOME.href}
        className="h-full flex items-center justify-center"
      >
        <Image
          src={"/LOGO_HORIZONTAL_945PX_V2.svg"}
          alt="COMA"
          width={150}
          height={150}
        />{" "}
      </Link>
      <ul className="flex flex-col items-start justify-center gap-2 text-white">
        {MenuFooterItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <li key={index} className="text-left">
              {item.title}
            </li>
          </Link>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
