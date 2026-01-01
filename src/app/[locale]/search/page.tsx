'use client'

import { useTranslations } from 'next-intl'
import { Search as SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchPage() {
  const t = useTranslations('search')

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('placeholder')}
          className="pl-10"
        />
      </div>

      <div className="mt-12 flex flex-col items-center justify-center py-12 text-center">
        <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">{t('placeholder')}</p>
      </div>
    </div>
  )
}
