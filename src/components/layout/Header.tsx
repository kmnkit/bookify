'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, Moon, Sun, Languages } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { locales, localeNames, type Locale } from '@/i18n/config'

export function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const currentLocale = pathname.split('/')[1] as Locale

  const switchLocale = (locale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '')
    router.push(`/${locale}${pathWithoutLocale || '/'}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={`/${currentLocale}`} className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Bookify</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={`/${currentLocale}`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('home')}
          </Link>
          <Link
            href={`/${currentLocale}/search`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('search')}
          </Link>
          <Link
            href={`/${currentLocale}/library`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {t('library')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">言語を切り替え</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((locale) => (
                <DropdownMenuItem
                  key={locale}
                  onClick={() => switchLocale(locale)}
                  className={currentLocale === locale ? 'bg-accent' : ''}
                >
                  {localeNames[locale]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">テーマを切り替え</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
