"use client"

import CVEditor from "@/components/cv/cvEditor"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronRight } from "lucide-react"

export default function CVEditPage() {

  return(
    <main>
    <Collapsible>
    <CollapsibleTrigger className="flex">EN <ChevronRight/></CollapsibleTrigger>
    <CollapsibleContent>
    <CVEditor lang="EN" />
    </CollapsibleContent>
    </Collapsible>

    <Collapsible>
    <CollapsibleTrigger className="flex">DE <ChevronRight/></CollapsibleTrigger>
    <CollapsibleContent>
    <CVEditor lang="DE" />
    </CollapsibleContent>
    </Collapsible>
    </main>
    
  )
}