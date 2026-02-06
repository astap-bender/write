import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Artwork } from '@/types'
import { ArtisticMap } from './ArtisticMap'
import { storageService } from '@/lib/storage'
import { ThumbsUp, ThumbsDown, MessageCircle, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface ArtworkCardProps {
  artwork: Artwork
  currentUserId: string | null
  onLikeChange?: (artworkId: string, type: 'like' | 'dislike' | 'none') => void
  onClick?: () => void
  compact?: boolean
}

interface AnimatingElement {
  id: string
  x: number
  y: number
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  currentUserId,
  onLikeChange,
  onClick,
  compact = false,
}) => {
  const [localLikes, setLocalLikes] = useState(artwork.likes)
  const [localDislikes, setLocalDislikes] = useState(artwork.dislikes)
  const [userLikeStatus, setUserLikeStatus] = useState<'like' | 'dislike' | 'none'>(
    currentUserId ? storageService.getUserLikeStatus(currentUserId, artwork.id) : 'none'
  )
  const [animatingElements, setAnimatingElements] = useState<AnimatingElement[]>([])

  const calculateRating = (likes: number, dislikes: number): number => {
    return likes * 2 - dislikes * 3
  }

  const createAnimation = (event: React.MouseEvent, type: 'like' | 'dislike') => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const newElement: AnimatingElement = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    setAnimatingElements((prev) => [...prev, newElement])

    setTimeout(() => {
      setAnimatingElements((prev) => prev.filter((el) => el.id !== newElement.id))
    }, 1000)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUserId) return

    createAnimation(e, 'like')

    const newStatus = userLikeStatus === 'like' ? 'none' : 'like'
    let likeDelta = 0
    let dislikeDelta = 0

    if (userLikeStatus === 'none') {
      likeDelta = 1
    } else if (userLikeStatus === 'like') {
      likeDelta = -1
    } else if (userLikeStatus === 'dislike') {
      likeDelta = 1
      dislikeDelta = -1
    }

    setLocalLikes(Math.max(0, localLikes + likeDelta))
    setLocalDislikes(Math.max(0, localDislikes + dislikeDelta))
    setUserLikeStatus(newStatus)

    const updatedArtwork = {
      ...artwork,
      likes: Math.max(0, localLikes + likeDelta),
      dislikes: Math.max(0, localDislikes + dislikeDelta),
    }
    storageService.saveArtwork(updatedArtwork)
    storageService.saveLike(currentUserId, artwork.id, newStatus)
    onLikeChange?.(artwork.id, newStatus)
  }

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUserId) return

    createAnimation(e, 'dislike')

    const newStatus = userLikeStatus === 'dislike' ? 'none' : 'dislike'
    let likeDelta = 0
    let dislikeDelta = 0

    if (userLikeStatus === 'none') {
      dislikeDelta = 1
    } else if (userLikeStatus === 'dislike') {
      dislikeDelta = -1
    } else if (userLikeStatus === 'like') {
      dislikeDelta = 1
      likeDelta = -1
    }

    setLocalLikes(Math.max(0, localLikes + likeDelta))
    setLocalDislikes(Math.max(0, localDislikes + dislikeDelta))
    setUserLikeStatus(newStatus)

    const updatedArtwork = {
      ...artwork,
      likes: Math.max(0, localLikes + likeDelta),
      dislikes: Math.max(0, localDislikes + dislikeDelta),
    }
    storageService.saveArtwork(updatedArtwork)
    storageService.saveLike(currentUserId, artwork.id, newStatus)
    onLikeChange?.(artwork.id, newStatus)
  }

  const rating = calculateRating(localLikes, localDislikes)
  const ratingColor = rating > 0 ? 'text-green-600' : rating < 0 ? 'text-red-600' : 'text-gray-600'

  if (compact) {
    return (
      <Card className="artwork-card cursor-pointer relative overflow-hidden" onClick={onClick}>
        <div className="absolute inset-0 opacity-0" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Avatar className="w-8 h-8">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {artwork.userName.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">{artwork.userName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {formatDistanceToNow(artwork.createdAt, {
                    addSuffix: true,
                    locale: ru,
                  })}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`ml-2 ${ratingColor} border-current`}>
              {rating > 0 ? '+' : ''}
              {rating}
            </Badge>
          </div>
          <h3 className="font-bold text-sm mt-2 line-clamp-2">{artwork.title}</h3>
          {artwork.description && <p className="text-xs text-gray-600 line-clamp-2 mt-1">{artwork.description}</p>}
        </CardHeader>

        <CardContent className="pb-3">
          <div className="text-xs text-gray-500 flex gap-3">
            <span>📍 {artwork.path.length} точек</span>
            <span>✏️ {artwork.drawings.length} штрихов</span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-0">
          <Button
            size="sm"
            variant={userLikeStatus === 'like' ? 'default' : 'ghost'}
            onClick={handleLike}
            className="flex-1 text-xs relative overflow-hidden"
          >
            <ThumbsUp className="w-3 h-3 mr-1" />
            {localLikes}
          </Button>
          <Button
            size="sm"
            variant={userLikeStatus === 'dislike' ? 'default' : 'ghost'}
            onClick={handleDislike}
            className="flex-1 text-xs relative overflow-hidden"
          >
            <ThumbsDown className="w-3 h-3 mr-1" />
            {localDislikes}
          </Button>
          <Button size="sm" variant="ghost" className="flex-1 text-xs" disabled>
            <MessageCircle className="w-3 h-3 mr-1" />
            {artwork.commentCount}
          </Button>
        </CardFooter>

        {animatingElements.map((element) => (
          <FloatingElement key={element.id} element={element} type="like" />
        ))}
      </Card>
    )
  }

  return (
    <Card className="artwork-card relative overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-10 h-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                {artwork.userName.charAt(0).toUpperCase()}
              </div>
            </Avatar>
            <div>
              <p className="font-semibold text-slate-900">{artwork.userName}</p>
              <p className="text-sm text-slate-600">
                {formatDistanceToNow(artwork.createdAt, {
                  addSuffix: true,
                  locale: ru,
                })}
              </p>
            </div>
          </div>
          <Badge className={`${ratingColor} border-current`}>
            {rating > 0 ? '+' : ''}
            {rating}
          </Badge>
        </div>
        <h2 className="font-bold text-xl mt-3 text-slate-900">{artwork.title}</h2>
        {artwork.description && <p className="text-gray-600 mt-2">{artwork.description}</p>}
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <ArtisticMap path={artwork.path} existingDrawings={artwork.drawings} readOnly={true} />

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">{localLikes}</div>
            <p className="text-xs text-green-700 mt-1 flex items-center justify-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              Нравится
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">{localDislikes}</div>
            <p className="text-xs text-red-700 mt-1 flex items-center justify-center gap-1">
              <ThumbsDown className="w-3 h-3" />
              Не нравится
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{artwork.commentCount}</div>
            <p className="text-xs text-blue-700 mt-1 flex items-center justify-center gap-1">
              <MessageCircle className="w-3 h-3" />
              Комментарии
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-gray-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span>📍 {artwork.path.length} точек маршрута</span>
          <span className="text-slate-300">•</span>
          <span>✏️ {artwork.drawings.length} штрихов</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t pt-4 bg-gradient-to-r from-slate-50 to-slate-100">
        <Button
          size="sm"
          variant={userLikeStatus === 'like' ? 'default' : 'outline'}
          onClick={handleLike}
          className="flex-1 relative overflow-hidden group"
        >
          <ThumbsUp className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Нравится ({localLikes})
        </Button>
        <Button
          size="sm"
          variant={userLikeStatus === 'dislike' ? 'default' : 'outline'}
          onClick={handleDislike}
          className="flex-1 relative overflow-hidden group"
        >
          <ThumbsDown className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Не нравится ({localDislikes})
        </Button>
        <Button size="sm" variant="outline" className="flex-1" disabled>
          <MessageCircle className="w-4 h-4 mr-2" />
          Комментарии
        </Button>
      </CardFooter>

      {animatingElements.map((element) => (
        <FloatingElement key={element.id} element={element} type="like" />
      ))}
    </Card>
  )
}

interface FloatingElementProps {
  element: AnimatingElement
  type: 'like' | 'dislike'
}

const FloatingElement: React.FC<FloatingElementProps> = ({ element, type }) => {
  const isLike = type === 'like'
  const emoji = isLike ? '❤️' : '👎'
  const color = isLike ? 'text-red-500' : 'text-blue-500'

  return (
    <div
      className={`fixed pointer-events-none ${color} text-3xl font-bold z-50`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        animation: 'float-up 1s ease-out forwards',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(0.5);
          }
        }
      `}</style>
      {emoji}
    </div>
  )
}
