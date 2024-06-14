import Link from "next/link";
import React from "react";
import { Logo } from "./logo";
import { MenuFooterItems } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="w-screen h-screen flex max-xs:flex-col items-center xs:justify-between p-8 bg-brandingDark">
      <Logo />
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
