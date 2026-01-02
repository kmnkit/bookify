'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLike } from '@/hooks/useLike'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'

interface LikeButtonProps {
  bookId: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'overlay'
  className?: string
  onAuthRequired?: () => void
}

export function LikeButton({
  bookId,
  size = 'md',
  variant = 'default',
  className,
  onAuthRequired,
}: LikeButtonProps) {
  const t = useTranslations('book')
  const { user } = useAuth()
  const { isLiked, isLoading, toggleLike } = useLike(bookId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      onAuthRequired?.()
      return
    }

    try {
      await toggleLike()
    } catch {
      // Error is handled in the hook
    }
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const variantClasses = {
    default: cn(
      'rounded-full transition-all',
      'hover:bg-pink-50 dark:hover:bg-pink-950/30',
      'focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2'
    ),
    overlay: cn(
      'rounded-full bg-white/90 shadow-sm transition-all',
      'hover:bg-white dark:bg-black/70 dark:hover:bg-black/90',
      'focus:outline-none focus:ring-2 focus:ring-pink-500/50'
    ),
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={isLiked ? t('unlike') : t('like')}
      aria-pressed={isLiked}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isLiked
            ? 'fill-pink-500 text-pink-500 scale-110'
            : 'text-gray-400 dark:text-gray-500',
          !isLiked && 'hover:text-pink-400 dark:hover:text-pink-400',
          isLoading && 'animate-pulse'
        )}
      />
    </button>
  )
}

interface LikeButtonControlledProps {
  isLiked: boolean
  isLoading?: boolean
  onToggle: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'overlay'
  className?: string
}

/**
 * Controlled version of LikeButton for use with external state management
 */
export function LikeButtonControlled({
  isLiked,
  isLoading = false,
  onToggle,
  size = 'md',
  variant = 'default',
  className,
}: LikeButtonControlledProps) {
  const t = useTranslations('book')

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggle()
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const variantClasses = {
    default: cn(
      'rounded-full transition-all',
      'hover:bg-pink-50 dark:hover:bg-pink-950/30',
      'focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-2'
    ),
    overlay: cn(
      'rounded-full bg-white/90 shadow-sm transition-all',
      'hover:bg-white dark:bg-black/70 dark:hover:bg-black/90',
      'focus:outline-none focus:ring-2 focus:ring-pink-500/50'
    ),
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        isLoading && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={isLiked ? t('unlike') : t('like')}
      aria-pressed={isLiked}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isLiked
            ? 'fill-pink-500 text-pink-500 scale-110'
            : 'text-gray-400 dark:text-gray-500',
          !isLiked && 'hover:text-pink-400 dark:hover:text-pink-400',
          isLoading && 'animate-pulse'
        )}
      />
    </button>
  )
}
