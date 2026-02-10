import { HLS_STREAMS, MOCK_DURATIONS, rawData } from '.'
import type { Video, Category } from '../types'


let videoIndex = 0

export const categories: Category[] = rawData.categories.map(cat => ({
  slug: cat.category.slug,
  name: cat.category.name,
  iconUrl: cat.category.iconUrl,
  videos: cat.contents.map(content => {
    const video: Video = {
      id: content.slug,
      title: content.title,
      thumbnailUrl: content.thumbnailUrl,
      videoUrl: HLS_STREAMS[videoIndex % HLS_STREAMS.length],
      duration: MOCK_DURATIONS[videoIndex % MOCK_DURATIONS.length],
      categorySlug: cat.category.slug,
      categoryName: cat.category.name,
      categoryIcon: cat.category.iconUrl
    }
    videoIndex++
    return video
  })
}))

export const allVideos: Video[] = categories.flatMap(cat => cat.videos)

export function getVideoById(id: string): Video | undefined {
  return allVideos.find(v => v.id === id)
}

export function getRelatedVideos(video: Video): Video[] {
  return allVideos.filter(v => v.categorySlug === video.categorySlug && v.id !== video.id)
}

export function getNextVideo(video: Video): Video | undefined {
  const categoryVideos = allVideos.filter(v => v.categorySlug === video.categorySlug)
  const currentIndex = categoryVideos.findIndex(v => v.id === video.id)
  return categoryVideos[currentIndex + 1] || categoryVideos[0]
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
