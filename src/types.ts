export interface Video {
  id: string
  title: string
  thumbnailUrl: string
  mediaUrl: string
  mediaType: string
  videoUrl: string
  duration: number
  categorySlug: string
  categoryName: string
  categoryIcon: string
}

export interface Category {
  slug: string
  name: string
  iconUrl: string
  videos: Video[]
}

export interface PlayerState {
  currentVideo: Video | null
  mode: 'hidden' | 'full' | 'mini'
  isPlaying: boolean
  duration: number
}

export type PlayerAction =
  | { type: 'SET_VIDEO'; video: Video }
  | { type: 'SET_MODE'; mode: PlayerState['mode'] }
  | { type: 'SET_PLAYING'; isPlaying: boolean }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'CLOSE' }
