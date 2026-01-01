'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Library, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Locale } from '@/i18n/config'

const navItems = [
  { key: 'home', icon: Home, href: '' },
  { key: 'search', icon: Search, href: '/search' },
  { key: 'library', icon: Library, href: '/library' },
  { key: 'settings', icon: Settings, href: '/settings' },
] as const

export function BottomNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const currentLocale = pathname.split('/')[1] as Locale

  const isActive = (href: string) => {
    const fullPath = `/${currentLocale}${href}`
    if (href === '') {
      return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`
    }
    return pathname.startsWith(fullPath)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.key}
                href={`/${currentLocale}${item.href}`}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 min-w-[64px] rounded-lg transition-colors',
                  active
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{t(item.key)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
