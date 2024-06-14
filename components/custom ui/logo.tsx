"use client";
import { PublicRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
interface LogoProps {
  tagline?: false;
  size?: "small" | "medium" | "large";
}
export const Logo = ({ tagline = false, size = "small" }: LogoProps) => {
  const { theme } = useTheme();
  const [actuallTheme, setActuallTheme] = useState(theme);
  const [url, setUrl] = useState(
    theme === "light"
      ? tagline
        ? "/LOGO_HORIZONTAL_TAGLINE_945PX.svg"
        : "/LOGO_HORIZONTAL_945PX.svg"
      : tagline
      ? "/LOGO_HORIZONTAL_TAGLINE_945PX_V2.svg"
      : "/LOGO_HORIZONTAL_945PX_V2.svg"
  );
  console.log("[theme] -> ", theme);
  useEffect(() => {
    setActuallTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (actuallTheme === "light") {
      setUrl(
        tagline
          ? "/LOGO_HORIZONTAL_TAGLINE_945PX.svg"
          : "/LOGO_HORIZONTAL_945PX.svg"
      );
    } else {
      setUrl(
        tagline
          ? "/LOGO_HORIZONTAL_TAGLINE_945PX_V2.svg"
          : "/LOGO_HORIZONTAL_945PX_V2.svg"
      );
    }
  }, [actuallTheme]);
  const sizeValue =
    size === "small"
      ? 150
      : size === "medium"
      ? 200
      : size === "large"
      ? 270
      : 0;

  return (
    <Link
      href={PublicRoute.HOME.href}
      className="h-full flex items-center justify-center"
    >
      <Image src={url} alt="COMA" width={sizeValue} height={sizeValue} />
    </Link>
  );
};
