"use client";

import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import ScrollToTop from "./scroll-to-top.provider";
import { ThemeProvider } from "./theme.provider";
import useSettingsStore from "@/hooks/use-settings";
import { use, useEffect } from "react";
import { getSettings } from "@/data/settings.data";

interface Props {
  children: React.ReactNode;
}

const AppProvider = ({ children }: Props) => {
  const { settings, setSettings } = useSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));
  useEffect(() => {
    console.log("[APP_PROIVIDER] -> ", "useEffect -> getSettings");
    async function fetchSettings() {
      const data = await getSettings();
      if (!data.error) {
        setSettings(data?.data!);
      }
    }
    fetchSettings();
  }, [setSettings]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="foodyapp-theme"
    >
      <NextTopLoader color="#4299e1" showSpinner={false} />
      <Toaster />
      <ScrollToTop>{children}</ScrollToTop>
    </ThemeProvider>
  );
};

export default AppProvider;
