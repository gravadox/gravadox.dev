"use client"
import { Download } from "lucide-react"
import { Button } from "../ui/button"

export function DownloadPdfButton() {

  return (
    <Button variant={"ghost"} className="p-2 border flex gap-1 items-center fixed right-2 bottom-2 rounded">
      <Download size={18} /> Download PDF
    </Button>
  )
}
