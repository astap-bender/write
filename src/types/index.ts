export interface GeoLocation {
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
}

export interface DrawingPoint {
  x: number
  y: number
  color: string
  size: number
}

export interface Artwork {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  title: string
  description?: string
  path: GeoLocation[]
  drawings: DrawingPoint[]
  createdAt: number
  updatedAt: number
  likes: number
  dislikes: number
  commentCount: number
  rating: number
  dateKey: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: number
}

export interface Comment {
  id: string
  artworkId: string
  userId: string
  userName: string
  text: string
  createdAt: number
}

export interface RecordingSession {
  isRecording: boolean
  startTime?: number
  currentPath: GeoLocation[]
  drawings: DrawingPoint[]
}
