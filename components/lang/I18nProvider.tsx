"use client";

import { ReactNode } from "react";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";


export default function I18nProvider({ lang, children }: { lang: string; children: ReactNode }) {
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
