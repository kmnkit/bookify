import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-muted-foreground">{t('recommended')}</p>
    </main>
  )
}
