"use client"

import { useEffect } from "react"
import i18n from "./i18n"

export function useTranslationLoader(locale: string) {
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }

  }, [locale])
}
