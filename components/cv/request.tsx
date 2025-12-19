"use client"
import { useAppTranslation } from "../lang/useAppTranslation"
import { Button } from "../ui/button"
import Link from "next/link"

export function RequestFullCv() {
  const {t} = useAppTranslation()
  return (
    <Link href="/contact">
    <Button variant={"ghost"} className="p-2 border flex gap-1 items-center fixed right-2 bottom-2 rounded">
      {t("cv.req")}
    </Button>
    </Link>
  )
}
