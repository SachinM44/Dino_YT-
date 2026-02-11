import { useEffect, useRef, type RefObject } from 'react'
import Hls from 'hls.js'

export function useHLS(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string,
  autoPlay: boolean = true
) {
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    const isHLS = src.includes('.m3u8')

    if (isHLS) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        hlsRef.current = hls
        hls.loadSource(src)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) video.play().catch(() => {})
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
            else hls.destroy()
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        video.src = src
        if (autoPlay) video.play().catch(() => {})
      }
    } else {
      // MP4 fallback
      video.src = src
      if (autoPlay) video.play().catch(() => {})
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src, autoPlay, videoRef])
}
