
import { useTranslation } from "next-i18next";
import i18n from "./i18n";
import { useTranslationLoader } from "./useTranslationLoader";

export function useAppTranslation(ns = "common") {
  const translation = useTranslation(ns);
  useTranslationLoader(i18n.language || "en");
  return translation;
}
