import React, { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArtworkCard } from './ArtworkCard'
import { Artwork, User } from '@/types'
import { sortArtworksByDate } from '@/lib/ranking'
import { User as UserIcon, Archive } from 'lucide-react'

interface UserProfileProps {
  user: User
  artworks: Artwork[]
  currentUserId: string | null
  onArtworkClick?: (artwork: Artwork) => void
  onLikeChange?: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  artworks,
  currentUserId,
  onArtworkClick,
  onLikeChange,
}) => {
  const sortedArtworks = useMemo(() => {
    return sortArtworksByDate(artworks, true)
  }, [artworks])

  const artworksByDate = useMemo(() => {
    const grouped: Record<string, Artwork[]> = {}
    sortedArtworks.forEach(artwork => {
      const date = artwork.dateKey
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(artwork)
    })
    return grouped
  }, [sortedArtworks])

  const dates = Object.keys(artworksByDate).sort().reverse()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                {user.name}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{artworks.length}</p>
              <p className="text-sm text-gray-600">Работ создано</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {artworks.reduce((sum, a) => sum + a.likes, 0)}
              </p>
              <p className="text-sm text-gray-600">Всего лайков</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {artworks.reduce((sum, a) => sum + a.commentCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Комментариев</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {dates.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <Archive className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">Нет работ</p>
            <p className="text-sm text-gray-500 mt-2">
              Начните создавать работы, чтобы заполнить архив
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {dates.map(date => (
            <div key={date}>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {new Date(date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <ScrollArea className="w-full">
                <div className="grid grid-cols-1 gap-4 pr-4">
                  {artworksByDate[date].map(artwork => (
                    <ArtworkCard
                      key={artwork.id}
                      artwork={artwork}
                      currentUserId={currentUserId}
                      compact={true}
                      onClick={() => onArtworkClick?.(artwork)}
                      onLikeChange={onLikeChange}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
