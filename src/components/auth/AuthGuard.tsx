'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { type Locale } from '@/i18n/config'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split('/')[1] as Locale

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${currentLocale}/login`)
    }
  }, [loading, isAuthenticated, router, currentLocale])

  if (loading) {
    return fallback || <AuthLoadingFallback />
  }

  if (!isAuthenticated) {
    return fallback || <AuthLoadingFallback />
  }

  return <>{children}</>
}

function AuthLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
