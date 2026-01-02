'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { BookOpen, Check, BookMarked, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useReadingProgress,
  type ReadingStatus,
} from '@/hooks/useReadingProgress'

interface ProgressSliderProps {
  bookId: string
  className?: string
  showStatusSelector?: boolean
}

const STATUS_COLORS = {
  want_to_read: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300',
  reading: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  finished: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
} as const

const STATUS_ICONS = {
  want_to_read: BookMarked,
  reading: BookOpen,
  finished: Check,
} as const

export function ProgressSlider({
  bookId,
  className,
  showStatusSelector = true,
}: ProgressSliderProps) {
  const t = useTranslations('library')
  const {
    status,
    progress,
    isLoading,
    updateProgress,
    updateStatus,
    removeFromLibrary,
  } = useReadingProgress(bookId)

  const [localProgress, setLocalProgress] = useState<number | null>(null)

  const handleProgressChange = useCallback((values: number[]) => {
    setLocalProgress(values[0])
  }, [])

  const handleProgressCommit = useCallback(
    async (values: number[]) => {
      try {
        await updateProgress(values[0])
        setLocalProgress(null)
      } catch {
        setLocalProgress(null)
      }
    },
    [updateProgress]
  )

  const handleStatusChange = useCallback(
    async (newStatus: ReadingStatus) => {
      try {
        await updateStatus(newStatus)
      } catch {
        // Error handled in hook
      }
    },
    [updateStatus]
  )

  const handleRemove = useCallback(async () => {
    try {
      await removeFromLibrary()
    } catch {
      // Error handled in hook
    }
  }, [removeFromLibrary])

  const displayProgress = localProgress ?? progress
  const StatusIcon = status ? STATUS_ICONS[status] : BookMarked

  // If not in library, show add to library button
  if (!status) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        <Button
          variant="outline"
          onClick={() => handleStatusChange('want_to_read')}
          disabled={isLoading}
          className="w-full"
        >
          <BookMarked className="mr-2 h-4 w-4" />
          {t('addToLibrary')}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Status Selector */}
      {showStatusSelector && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2',
                  STATUS_COLORS[status]
                )}
                disabled={isLoading}
              >
                <StatusIcon className="h-4 w-4" />
                {t(`status.${status}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => handleStatusChange('want_to_read')}
                className={cn(
                  status === 'want_to_read' && 'bg-accent'
                )}
              >
                <BookMarked className="mr-2 h-4 w-4" />
                {t('status.want_to_read')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('reading')}
                className={cn(
                  status === 'reading' && 'bg-accent'
                )}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {t('status.reading')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('finished')}
                className={cn(
                  status === 'finished' && 'bg-accent'
                )}
              >
                <Check className="mr-2 h-4 w-4" />
                {t('status.finished')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleRemove}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('removeFromLibrary')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Progress Slider */}
      {status === 'reading' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('readingProgress')}</span>
            <span className="font-medium">{displayProgress}%</span>
          </div>
          <Slider
            value={[displayProgress]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleProgressChange}
            onValueCommit={handleProgressCommit}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      )}

      {/* Progress Display for finished */}
      {status === 'finished' && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Check className="h-4 w-4" />
          <span>{t('completedReading')}</span>
        </div>
      )}
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  status?: ReadingStatus | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

/**
 * Simple progress bar display (read-only)
 */
export function ProgressBar({
  progress,
  status,
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const t = useTranslations('library')

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const progressColor =
    status === 'finished'
      ? 'bg-green-500 dark:bg-green-400'
      : 'bg-primary'

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {status ? t(`status.${status}`) : t('progress')}
          </span>
          <span>{progress}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700',
          heightClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            progressColor
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

interface ReadingStatusBadgeProps {
  status: ReadingStatus
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Badge component for displaying reading status
 */
export function ReadingStatusBadge({
  status,
  size = 'md',
  className,
}: ReadingStatusBadgeProps) {
  const t = useTranslations('library')
  const StatusIcon = STATUS_ICONS[status]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        STATUS_COLORS[status],
        className
      )}
    >
      <StatusIcon className={iconSizes[size]} />
      {t(`status.${status}`)}
    </span>
  )
}
