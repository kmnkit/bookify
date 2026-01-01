import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP, Noto_Sans_KR } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { Header, BottomNav } from '@/components/layout'
import { Toaster } from '@/components/ui/sonner'
import { locales, type Locale } from '@/i18n/config'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
})

export const metadata: Metadata = {
  title: 'Bookify - Your Personal Reading Companion',
  description: 'Discover books, track your reading progress, and get AI-powered summaries',
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansJP.variable} ${notoSansKR.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
              <BottomNav />
            </div>
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
