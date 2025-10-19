"use client";

import * as React from "react";
import i18n from "@/components/lang/i18n";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = React.useState(i18n.language);

  const changeLanguage = (lng: "de" | "en") => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/; max-age=315360000`;
    setCurrentLang(lng);
    window.location.reload(); 
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          {currentLang}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col justify-center !max-w-20">
        <DropdownMenuItem className="flex justify-center" onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem className="flex justify-center" onClick={() => changeLanguage("de")}>German</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
