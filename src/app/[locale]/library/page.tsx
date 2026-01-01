'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Library, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { type Locale } from '@/i18n/config'

export default function LibraryPage() {
  const t = useTranslations('library')
  const tAuth = useTranslations('auth')
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()

  const currentLocale = pathname.split('/')[1] as Locale

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-48 rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Library className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">{tAuth('loginRequired')}</p>
          <Button onClick={() => router.push(`/${currentLocale}/login`)}>
            {tAuth('login')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      <Tabs defaultValue="liked" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="liked">{t('liked')}</TabsTrigger>
          <TabsTrigger value="reading">{t('reading')}</TabsTrigger>
          <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="liked" className="mt-6">
          <EmptyState message={t('empty')} />
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          <EmptyState message={t('empty')} />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <EmptyState message={t('empty')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
