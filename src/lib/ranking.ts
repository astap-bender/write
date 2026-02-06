import { Artwork } from '@/types'

export function calculateRating(artwork: Artwork): number {
  const likeWeight = 2
  const dislikeWeight = -3
  return artwork.likes * likeWeight + artwork.dislikes * dislikeWeight
}

export function sortArtworksByRating(artworks: Artwork[]): Artwork[] {
  return [...artworks].sort((a, b) => {
    const ratingA = calculateRating(a)
    const ratingB = calculateRating(b)
    return ratingB - ratingA
  })
}

export function sortArtworksByDate(artworks: Artwork[], descending = true): Artwork[] {
  return [...artworks].sort((a, b) => {
    if (descending) {
      return b.createdAt - a.createdAt
    }
    return a.createdAt - b.createdAt
  })
}
