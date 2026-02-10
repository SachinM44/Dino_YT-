export interface Video {
  id: string
  title: string
  thumbnailUrl: string
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
  playbackPosition: number
  isPlaying: boolean
  isMuted: boolean
  volume: number
  duration: number
  buffered: number
}

export type PlayerAction =
  | { type: 'SET_VIDEO'; video: Video }
  | { type: 'SET_MODE'; mode: PlayerState['mode'] }
  | { type: 'SET_PLAYING'; isPlaying: boolean }
  | { type: 'SET_POSITION'; position: number }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'SET_BUFFERED'; buffered: number }
  | { type: 'SET_MUTED'; isMuted: boolean }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'CLOSE' }
