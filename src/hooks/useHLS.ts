import { useEffect, useRef, type RefObject } from 'react'
import Hls from 'hls.js'

interface UseHLSReturn {
  isLoading: boolean
  error: string | null
}

export function useHLS(
  videoRef: RefObject<HTMLVideoElement | null>,
  src: string,
  autoPlay: boolean = true
): UseHLSReturn {
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    const isHLS = src.includes('.m3u8')

    if (isHLS) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        })
        hlsRef.current = hls
        hls.loadSource(src)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            video.play().catch(() => {})
          }
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
              default:
                hls.destroy()
                break
            }
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
        if (autoPlay) {
          video.play().catch(() => {})
        }
      }
    } else {
      video.src = src
      if (autoPlay) {
        video.play().catch(() => {})
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src, autoPlay, videoRef])

  return {
    isLoading: false,
    error: null
  }
}
