import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ArtworkCard } from './ArtworkCard'
import { Artwork } from '@/types'
import { sortArtworksByRating, sortArtworksByDate } from '@/lib/ranking'
import { Flame, Clock, TrendingUp, TrendingDown, Sparkles, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface FeedProps {
  artworks: Artwork[]
  currentUserId: string | null
  onArtworkClick?: (artwork: Artwork) => void
  onLikeChange?: () => void
}

interface ArtworkWithMetadata extends Artwork {
  ratingTrend?: 'up' | 'down' | 'stable'
  previousRating?: number
  isPopular?: boolean
  trendScore?: number
}

const calculateRating = (artwork: Artwork): number => {
  const likeWeight = 2
  const dislikeWeight = -3
  return artwork.likes * likeWeight + artwork.dislikes * dislikeWeight
}

const isArtworkPopular = (artwork: Artwork): boolean => {
  const totalEngagement = artwork.likes + artwork.dislikes + artwork.commentCount
  return totalEngagement >= 5
}

const calculateTrendScore = (artwork: Artwork): number => {
  const likes = artwork.likes || 0
  const dislikes = artwork.dislikes || 0
  const comments = artwork.commentCount || 0
  
  return likes * 3 + comments * 2 - dislikes * 2
}

export const Feed: React.FC<FeedProps> = ({
  artworks,
  currentUserId,
  onArtworkClick,
  onLikeChange,
}) => {
  const [sortBy, setSortBy] = useState<'rating' | 'date' | 'hottest'>('rating')
  const [visibleCount, setVisibleCount] = useState(6)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [likeAnimations, setLikeAnimations] = useState<Set<string>>(new Set())

  const sortedArtworks = useMemo(() => {
    let sorted: Artwork[] = []

    if (sortBy === 'rating') {
      sorted = sortArtworksByRating(artworks)
    } else if (sortBy === 'date') {
      sorted = sortArtworksByDate(artworks, true)
    } else if (sortBy === 'hottest') {
      sorted = [...artworks].sort((a, b) => {
        const scoreA = calculateTrendScore(a)
        const scoreB = calculateTrendScore(b)
        return scoreB - scoreA
      })
    }

    return sorted.map((artwork) => ({
      ...artwork,
      isPopular: isArtworkPopular(artwork),
      trendScore: calculateTrendScore(artwork),
    }))
  }, [artworks, sortBy])

  const visibleArtworks = sortedArtworks.slice(0, visibleCount)

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    const isNearEnd = scrollLeft + clientWidth >= scrollWidth - 200

    if (isNearEnd && visibleCount < sortedArtworks.length) {
      setVisibleCount((prev) => Math.min(prev + 6, sortedArtworks.length))
    }
  }, [visibleCount, sortedArtworks.length])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  const triggerLikeAnimation = useCallback((artworkId: string) => {
    setLikeAnimations((prev) => new Set(prev).add(artworkId))
    setTimeout(() => {
      setLikeAnimations((prev) => {
        const next = new Set(prev)
        next.delete(artworkId)
        return next
      })
    }, 600)
  }, [])

  const handleArtworkClick = (artwork: ArtworkWithMetadata) => {
    onArtworkClick?.(artwork)
  }

  const handleLikeChangeWithAnimation = () => {
    onLikeChange?.()
  }

  if (sortedArtworks.length === 0) {
    return (
      <Card className="border-2 border-dashed bg-gradient-to-br from-slate-50 to-slate-100">
        <CardContent className="py-16 text-center">
          <div className="flex flex-col items-center justify-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg font-medium">Нет работ для отображения</p>
            <p className="text-sm text-gray-500 mt-2">
              Начните запись новой работы или посетите профили других пользователей
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Flame className="w-6 h-6 text-orange-500" />
                Галерея работ
              </CardTitle>
              <CardDescription className="mt-2">
                Просматривайте и оценивайте творческие работы художников
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {sortedArtworks.length} работ
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="rating"
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value as 'rating' | 'date' | 'hottest')
              setVisibleCount(6)
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-slate-200 p-1 rounded-lg">
              <TabsTrigger value="rating" className="flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">По рейтингу</span>
                <span className="sm:hidden">Рейтинг</span>
              </TabsTrigger>
              <TabsTrigger value="hottest" className="flex items-center justify-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="hidden sm:inline">Горячие</span>
                <span className="sm:hidden">Тренд</span>
              </TabsTrigger>
              <TabsTrigger value="date" className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">По дате</span>
                <span className="sm:hidden">Дата</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              {['rating', 'hottest', 'date'].map((tab) => (
                <TabsContent
                  key={tab}
                  value={tab}
                  className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <ScrollArea className="w-full">
                    <div
                      ref={scrollContainerRef}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4"
                    >
                      {visibleArtworks.map((artwork) => (
                        <div
                          key={artwork.id}
                          className="relative group"
                          onAnimationEnd={() => {
                            if (likeAnimations.has(artwork.id)) {
                              likeAnimations.delete(artwork.id)
                            }
                          }}
                        >
                          <FeedArtworkCard
                            artwork={artwork}
                            currentUserId={currentUserId}
                            onClick={() => handleArtworkClick(artwork)}
                            onLikeChange={() => {
                              triggerLikeAnimation(artwork.id)
                              handleLikeChangeWithAnimation()
                            }}
                            isAnimating={likeAnimations.has(artwork.id)}
                          />
                        </div>
                      ))}
                    </div>

                    {visibleCount < sortedArtworks.length && (
                      <div className="mt-8 flex justify-center pb-4">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setVisibleCount((prev) =>
                              Math.min(prev + 6, sortedArtworks.length)
                            )
                          }
                          className="px-8"
                        >
                          Загрузить ещё ({sortedArtworks.length - visibleCount})
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface FeedArtworkCardProps {
  artwork: ArtworkWithMetadata
  currentUserId: string | null
  onClick?: () => void
  onLikeChange?: () => void
  isAnimating?: boolean
}

const FeedArtworkCard: React.FC<FeedArtworkCardProps> = ({
  artwork,
  currentUserId,
  onClick,
  onLikeChange,
  isAnimating = false,
}) => {
  const rating = calculateRating(artwork)
  const ratingColor =
    rating > 0 ? 'text-green-600 bg-green-50' : rating < 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'

  const engagementLevel = artwork.likes + artwork.dislikes + artwork.commentCount

  return (
    <Card
      className={`artwork-card cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 border-slate-200 ${
        isAnimating ? 'ring-2 ring-yellow-400 animate-pulse' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
              {artwork.userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate text-slate-900">{artwork.userName}</p>
              <p className="text-xs text-slate-500 truncate">
                {formatDistanceToNow(artwork.createdAt, {
                  addSuffix: true,
                  locale: ru,
                })}
              </p>
            </div>
          </div>

          <div className={`ml-2 px-2.5 py-1 rounded-md font-bold text-sm flex-shrink-0 ${ratingColor}`}>
            {rating > 0 ? '+' : ''}
            {rating}
          </div>
        </div>

        <h3 className="font-bold text-base mt-3 line-clamp-2 text-slate-900">{artwork.title}</h3>

        {artwork.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-tight">{artwork.description}</p>
        )}

        {artwork.isPopular && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Flame className="w-3 h-3" />
            Популярно
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-3 pt-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 rounded-lg p-2">
            <span className="flex items-center gap-1">
              <span>📍 {artwork.path.length}</span>
              <span className="text-slate-400">•</span>
              <span>✏️ {artwork.drawings.length}</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-700 text-sm">{artwork.likes}</span>
              </div>
              <p className="text-xs text-green-600">Нравится</p>
            </div>

            <div className="bg-red-50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <ThumbsDown className="w-4 h-4 text-red-600" />
                <span className="font-bold text-red-700 text-sm">{artwork.dislikes}</span>
              </div>
              <p className="text-xs text-red-600">Не нравится</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-700 text-sm">{artwork.commentCount}</span>
              </div>
              <p className="text-xs text-blue-600">Комментарии</p>
            </div>
          </div>

          {engagementLevel > 0 && (
            <div className="bg-slate-100 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">Уровень вовлечённости</span>
                <span className="text-xs font-bold text-slate-800">{engagementLevel}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                  style={{
                    width: `${Math.min((engagementLevel / 20) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onLikeChange?.()
          }}
          className="flex-1 text-xs h-8 hover:bg-green-100 hover:text-green-700 transition-colors"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onLikeChange?.()
          }}
          className="flex-1 text-xs h-8 hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          className="flex-1 text-xs h-8 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
