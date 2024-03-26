"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ScrollToTopProps {
  children: ReactNode;
}

function ScrollToTop({ children }: ScrollToTopProps) {
  const navigate = useRouter();
  const location = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, navigate]);

  return <>{children}</>;
}

export default ScrollToTop;
