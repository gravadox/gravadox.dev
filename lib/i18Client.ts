import i18n from "@/components/lang/i18n";
import { useTranslation } from "next-i18next";
import { useTranslationLoader } from "@/components/lang/useTranslationLoader";

export function useT(namespace: string = "common") {
  useTranslationLoader(i18n.language || "en");
  const { t } = useTranslation(namespace);
  return t;
}
