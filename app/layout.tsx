import type { Metadata } from "next";
import { VT323 ,Geist } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import I18nProvider from "@/components/lang/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"]
})


export const metadata: Metadata = {
  title: "Gravadox",
  description: "Software and web developer, projects in full-stack development, desktop applications, blog, and open-source work",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const cookieStore = cookies();
  const lang =  (await cookieStore).get("i18next")?.value
  console.log(lang)

  return (
    <html lang={lang} className="dark">
      <body
        className={`${geistSans.variable} ${vt323.className} antialiased`}
      >
        <I18nProvider lang={lang || "en"}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
