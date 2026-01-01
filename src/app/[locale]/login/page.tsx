'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { type Locale } from '@/i18n/config'

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

interface LoginPageProps {
  params: Promise<{ locale: Locale }>
}

export default function LoginPage({ params }: LoginPageProps) {
  const t = useTranslations('auth')
  const router = useRouter()
  const { signInWithGoogle, signInWithApple, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setIsLoading('google')
    setError(null)
    try {
      await signInWithGoogle()
      const { locale } = await params
      router.push(`/${locale}`)
    } catch (err) {
      console.error('Google sign in error:', err)
      setError(t('loginError'))
    } finally {
      setIsLoading(null)
    }
  }

  const handleAppleSignIn = async () => {
    setIsLoading('apple')
    setError(null)
    try {
      await signInWithApple()
      const { locale } = await params
      router.push(`/${locale}`)
    } catch (err) {
      console.error('Apple sign in error:', err)
      setError(t('loginError'))
    } finally {
      setIsLoading(null)
    }
  }

  const handleContinueAsGuest = async () => {
    const { locale } = await params
    router.push(`/${locale}`)
  }

  if (isAuthenticated) {
    params.then(({ locale }) => {
      router.push(`/${locale}`)
    })
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 pb-20 md:pb-0">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">
            {t('loginTitle')}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {t('loginSubtitle')}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {t('loginDescription')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Login Buttons */}
        <div className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            className="relative h-12 w-full text-base"
            onClick={handleGoogleSignIn}
            disabled={isLoading !== null}
          >
            {isLoading === 'google' ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('loggingIn')}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <GoogleIcon className="h-5 w-5" />
                {t('signInWithGoogle')}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="relative h-12 w-full text-base"
            onClick={handleAppleSignIn}
            disabled={isLoading !== null}
          >
            {isLoading === 'apple' ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('loggingIn')}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <AppleIcon className="h-5 w-5" />
                {t('signInWithApple')}
              </span>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="lg"
            className="h-12 w-full text-base"
            onClick={handleContinueAsGuest}
            disabled={isLoading !== null}
          >
            {t('continueAsGuest')}
          </Button>
        </div>

        {/* Terms Notice */}
        <p className="text-center text-xs text-muted-foreground">
          {t('termsNotice')}
        </p>
      </div>
    </div>
  )
}
