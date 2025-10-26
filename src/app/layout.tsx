"use client";

import "@/presentation/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { I18nProvider } from "@/core/i18n/I18nProvider";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@/core/hooks/useTheme";

interface RootLayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: RootLayoutProps) => {
  const { t, i18n } = useTranslation("layout");
  const { theme } = useTheme();

  useEffect(() => {
    document.title = t("title");

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", t("description"));
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = t("description");
      document.head.appendChild(meta);
    }
  }, [t, i18n.language]);

  return (
    <html lang={i18n.language} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-default antialiased">
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === "dark" ? "dark" : "light"}
        />
      </body>
    </html>
  );
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <I18nProvider>
      <LayoutContent>{children}</LayoutContent>
    </I18nProvider>
  );
};

export default RootLayout;
