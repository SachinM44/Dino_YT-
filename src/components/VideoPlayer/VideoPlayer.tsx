import { useEffect, useState, useCallback, useRef } from 'react'
import { usePlayer } from '../../contexts/PlayerContext'
import { useHLS } from '../../hooks/useHLS'
import { useDragGesture } from '../../hooks/useDragGesture'
import { Controls } from './Controls'
import { RelatedVideos } from './RelatedVideos'
import { getNextVideo } from '../../data/videos'

export function VideoPlayer() {
    const { state, dispatch, videoRef } = usePlayer()
    const { currentVideo, mode, isPlaying } = state

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [buffered, setBuffered] = useState(0)
    const [showControls, setShowControls] = useState(true)
    const [isEnded, setIsEnded] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [autoplayCountdown, setAutoplayCountdown] = useState<number | null>(null)

    const controlsTimeoutRef = useRef<number | null>(null)
    const countdownRef = useRef<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useHLS(videoRef, currentVideo?.videoUrl || '', true)

    const { elementRef, handlers } = useDragGesture(() => {
        if (mode === 'full') dispatch({ type: 'SET_MODE', mode: 'mini' })
    })

    const handlePlayPause = useCallback(() => {
        const video = videoRef.current
        if (!video) return

        if (video.paused) {
            video.play()
            dispatch({ type: 'SET_PLAYING', isPlaying: true })
        } else {
            video.pause()
            dispatch({ type: 'SET_PLAYING', isPlaying: false })
        }
    }, [videoRef, dispatch])

    const handleSeek = useCallback((time: number) => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = time
        setCurrentTime(time)
    }, [videoRef])

    const handleSkip = useCallback((seconds: number) => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration))
    }, [videoRef, duration])

    const handleClose = useCallback(() => {
        const video = videoRef.current
        if (video) {
            video.pause()
            video.src = ''
        }
        dispatch({ type: 'CLOSE' })
    }, [videoRef, dispatch])

    const handleMinimize = useCallback(() => {
        // Exit fullscreen first if in fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen()
        }
        dispatch({ type: 'SET_MODE', mode: 'mini' })
    }, [dispatch])

    const handleExpand = useCallback(() => {
        dispatch({ type: 'SET_MODE', mode: 'full' })
    }, [dispatch])

    const handleFullscreenToggle = useCallback(() => {
        const el = containerRef.current
        if (!el) return

        if (!document.fullscreenElement) {
            el.requestFullscreen().then(() => {
                setIsFullscreen(true)
                const orient = screen.orientation as any
                if (orient?.lock) orient.lock('landscape').catch(() => { })
            }).catch(() => { })
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false)
                const orient = screen.orientation as any
                if (orient?.unlock) orient.unlock()
            }).catch(() => { })
        }
    }, [])

    const cancelAutoplay = useCallback(() => {
        setAutoplayCountdown(null)
        if (countdownRef.current) {
            clearInterval(countdownRef.current)
            countdownRef.current = null
        }
    }, [])

    const showControlsTemporarily = useCallback(() => {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
        }
        controlsTimeoutRef.current = window.setTimeout(() => {
            if (isPlaying && !isEnded) {
                setShowControls(false)
            }
        }, 3000)
    }, [isPlaying, isEnded])

    // Listen for fullscreen changes (e.g. user presses Escape)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime)
            if (video.buffered.length > 0) {
                setBuffered(video.buffered.end(video.buffered.length - 1))
            }
        }

        const handleLoadedMetadata = () => {
            setDuration(video.duration)
            dispatch({ type: 'SET_DURATION', duration: video.duration })
        }

        const handleEnded = () => {
            setIsEnded(true)
            dispatch({ type: 'SET_PLAYING', isPlaying: false })

            if (currentVideo) {
                const next = getNextVideo(currentVideo)
                if (next) {
                    setAutoplayCountdown(2)
                    countdownRef.current = window.setInterval(() => {
                        setAutoplayCountdown(prev => {
                            if (prev === null || prev <= 1) {
                                clearInterval(countdownRef.current!)
                                countdownRef.current = null
                                dispatch({ type: 'SET_VIDEO', video: next })
                                setIsEnded(false)
                                return null
                            }
                            return prev - 1
                        })
                    }, 1000)
                }
            }
        }

        const handlePlay = () => {
            dispatch({ type: 'SET_PLAYING', isPlaying: true })
            setIsEnded(false)
        }

        const handlePause = () => {
            dispatch({ type: 'SET_PLAYING', isPlaying: false })
        }

        video.addEventListener('timeupdate', handleTimeUpdate)
        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('ended', handleEnded)
        video.addEventListener('play', handlePlay)
        video.addEventListener('pause', handlePause)

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate)
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('ended', handleEnded)
            video.removeEventListener('play', handlePlay)
            video.removeEventListener('pause', handlePause)
        }
    }, [videoRef, dispatch, currentVideo])

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
            if (countdownRef.current) clearInterval(countdownRef.current)
        }
    }, [])

    if (!currentVideo || mode === 'hidden') return null

    if (mode === 'mini') {
        return (
            <div className="video-player-container minimized" onClick={handleExpand}>
                <div className="video-wrapper">
                    <video ref={videoRef} playsInline />
                </div>
                <div className="mini-player-info">
                    <span className="mini-player-title">{currentVideo.title}</span>
                </div>
                <div className="mini-player-controls" onClick={e => e.stopPropagation()}>
                    <button className="control-btn" onClick={handlePlayPause}>
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>
                    <button className="control-btn" onClick={handleClose}>
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={(el) => {
                (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            className={`video-player-container ${isFullscreen ? 'fullscreen-mode' : ''}`}
            onClick={showControlsTemporarily}
            onMouseMove={showControlsTemporarily}
            onTouchStart={showControlsTemporarily}
        >
            <div className="drag-handle" {...handlers} />
            <div className="video-wrapper">
                <video ref={videoRef} playsInline />
                <Controls
                    videoRef={videoRef}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    buffered={buffered}
                    onPlayPause={handlePlayPause}
                    onSeek={handleSeek}
                    onSkip={handleSkip}
                    onClose={handleClose}
                    onMinimize={handleMinimize}
                    onFullscreenToggle={handleFullscreenToggle}
                    isFullscreen={isFullscreen}
                    title={currentVideo.title}
                    showControls={showControls}
                    isEnded={isEnded}
                />
                {autoplayCountdown !== null && (
                    <div className="autoplay-overlay">
                        <span className="autoplay-countdown">{autoplayCountdown}</span>
                        <span className="autoplay-text">Playing next video...</span>
                        <button className="autoplay-cancel" onClick={cancelAutoplay}>Cancel</button>
                    </div>
                )}
            </div>
            <RelatedVideos video={currentVideo} />
        </div>
    )
}
