import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'sonner'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Evently - O melhor gerenciador de eventos',
  description: 'Aplicação Full Stack para gerenciamento de eventos.',
  authors: [{ name: 'Nexus Code' }],
  icons: {
    icon: '/assets/images/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={poppins.variable}>
          {children}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
