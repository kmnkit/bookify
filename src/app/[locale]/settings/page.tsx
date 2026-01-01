'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { User, Globe, Languages, Moon, Sun, LogOut, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { getUser, updateUser, type UserProfile } from '@/lib/firebase/firestore/users'
import { locales, localeNames, type Locale } from '@/i18n/config'

const countries = [
  { code: 'JP', name: '日本', nameEn: 'Japan', nameKo: '일본' },
  { code: 'US', name: 'アメリカ', nameEn: 'United States', nameKo: '미국' },
  { code: 'KR', name: '韓国', nameEn: 'South Korea', nameKo: '한국' },
  { code: 'GB', name: 'イギリス', nameEn: 'United Kingdom', nameKo: '영국' },
  { code: 'DE', name: 'ドイツ', nameEn: 'Germany', nameKo: '독일' },
  { code: 'FR', name: 'フランス', nameEn: 'France', nameKo: '프랑스' },
  { code: 'CA', name: 'カナダ', nameEn: 'Canada', nameKo: '캐나다' },
  { code: 'AU', name: 'オーストラリア', nameEn: 'Australia', nameKo: '호주' },
]

export default function SettingsPage() {
  const t = useTranslations('settings')
  const tAuth = useTranslations('auth')
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, signOut } = useAuth()

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const currentLocale = pathname.split('/')[1] as Locale

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await getUser(user.uid)
          setUserProfile(profile)
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
        }
      }
      setIsLoading(false)
    }

    fetchUserProfile()
  }, [user?.uid])

  const handleCountryChange = async (countryCode: string) => {
    if (!user?.uid) return

    setIsSaving(true)
    try {
      await updateUser(user.uid, { country: countryCode })
      setUserProfile((prev) => (prev ? { ...prev, country: countryCode } : null))
    } catch (error) {
      console.error('Failed to update country:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLanguageChange = (locale: Locale) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '')
    router.push(`/${locale}${pathWithoutLocale || '/settings'}`)

    if (user?.uid) {
      updateUser(user.uid, { language: locale }).catch(console.error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push(`/${currentLocale}/login`)
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const getCountryName = (code: string) => {
    const country = countries.find((c) => c.code === code)
    if (!country) return code

    switch (currentLocale) {
      case 'en':
        return country.nameEn
      case 'ko':
        return country.nameKo
      default:
        return country.name
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return t('darkMode')
      case 'light':
        return t('lightMode')
      default:
        return t('systemMode')
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        {isAuthenticated && user && (
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">{t('profile')}</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.displayName || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Country Selection */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{t('country')}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2" disabled={isSaving}>
                  <span>
                    {isLoading
                      ? '...'
                      : getCountryName(userProfile?.country || 'JP')}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {countries.map((country) => (
                  <DropdownMenuItem
                    key={country.code}
                    onClick={() => handleCountryChange(country.code)}
                    className="cursor-pointer"
                  >
                    {currentLocale === 'en'
                      ? country.nameEn
                      : currentLocale === 'ko'
                        ? country.nameKo
                        : country.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Language Selection */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{t('language')}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span>{localeNames[currentLocale]}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {locales.map((locale) => (
                  <DropdownMenuItem
                    key={locale}
                    onClick={() => handleLanguageChange(locale)}
                    className="cursor-pointer"
                  >
                    {localeNames[locale]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Theme Selection */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="font-medium">{t('theme')}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span>{getThemeLabel()}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setTheme('light')}
                  className="cursor-pointer"
                >
                  {t('lightMode')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('dark')}
                  className="cursor-pointer"
                >
                  {t('darkMode')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  className="cursor-pointer"
                >
                  {t('systemMode')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Sign Out */}
        {isAuthenticated && (
          <Card className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span>{tAuth('logout')}</span>
            </Button>
          </Card>
        )}

        {/* Login Prompt */}
        {!isAuthenticated && (
          <Card className="p-4">
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">{tAuth('loginRequired')}</p>
              <Button onClick={() => router.push(`/${currentLocale}/login`)}>
                {tAuth('login')}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
