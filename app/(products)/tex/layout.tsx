import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TEx - Type less. Expand instantly.',
  description: 'A lightweight keyboard abbreviation app for Windows and Linux.',
  icons: {
    icon: [
      {
        url: '/TEx.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/TEx.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <>
        {children}
      </>
  )
}
