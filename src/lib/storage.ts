import { Artwork, User, Comment } from '@/types'

const STORAGE_KEYS = {
  CURRENT_USER: 'artist_app_current_user',
  ARTWORKS: 'artist_app_artworks',
  COMMENTS: 'artist_app_comments',
  USER_LIKES: 'artist_app_user_likes',
}

export const storageService = {
  saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return data ? JSON.parse(data) : null
  },

  clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  },

  saveArtwork(artwork: Artwork): void {
    const artworks = getAllArtworks()
    const index = artworks.findIndex(a => a.id === artwork.id)
    if (index >= 0) {
      artworks[index] = artwork
    } else {
      artworks.push(artwork)
    }
    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(artworks))
  },

  getArtwork(id: string): Artwork | null {
    const artworks = getAllArtworks()
    return artworks.find(a => a.id === id) || null
  },

  deleteArtwork(id: string): void {
    const artworks = getAllArtworks()
    const filtered = artworks.filter(a => a.id !== id)
    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(filtered))
  },

  saveComment(comment: Comment): void {
    const comments = getAllComments()
    comments.push(comment)
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
  },

  getCommentsByArtworkId(artworkId: string): Comment[] {
    const comments = getAllComments()
    return comments.filter(c => c.artworkId === artworkId)
  },

  saveLike(userId: string, artworkId: string, type: 'like' | 'dislike' | 'none'): void {
    const likes = getLikes()
    const key = `${userId}:${artworkId}`
    likes[key] = type
    localStorage.setItem(STORAGE_KEYS.USER_LIKES, JSON.stringify(likes))
  },

  getUserLikeStatus(userId: string, artworkId: string): 'like' | 'dislike' | 'none' {
    const likes = getLikes()
    const key = `${userId}:${artworkId}`
    return likes[key] || 'none'
  },
}

function getAllArtworks(): Artwork[] {
  const data = localStorage.getItem(STORAGE_KEYS.ARTWORKS)
  return data ? JSON.parse(data) : []
}

function getAllComments(): Comment[] {
  const data = localStorage.getItem(STORAGE_KEYS.COMMENTS)
  return data ? JSON.parse(data) : []
}

function getLikes(): Record<string, 'like' | 'dislike' | 'none'> {
  const data = localStorage.getItem(STORAGE_KEYS.USER_LIKES)
  return data ? JSON.parse(data) : {}
}

export function getAllArtworksPublic(): Artwork[] {
  return getAllArtworks()
}

export function getArtworksByUserId(userId: string): Artwork[] {
  return getAllArtworks().filter(a => a.userId === userId)
}
