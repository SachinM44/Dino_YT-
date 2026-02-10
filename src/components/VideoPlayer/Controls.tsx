import { useState, useCallback } from 'react'
import { ProgressBar } from './ProgressBar'
import { formatDuration } from '../../data/videos'

interface ControlsProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    isPlaying: boolean
    currentTime: number
    duration: number
    buffered: number
    onPlayPause: () => void
    onSeek: (time: number) => void
    onSkip: (seconds: number) => void
    onClose: () => void
    onMinimize: () => void
    title: string
    showControls: boolean
    isEnded: boolean
}

export function Controls({
    videoRef,
    isPlaying,
    currentTime,
    duration,
    buffered,
    onPlayPause,
    onSeek,
    onSkip,
    onClose,
    onMinimize,
    title,
    showControls,
    isEnded
}: ControlsProps) {
    const [skipAnimation, setSkipAnimation] = useState<'left' | 'right' | null>(null)

    const handleSkip = (seconds: number) => {
        setSkipAnimation(seconds < 0 ? 'left' : 'right')
        onSkip(seconds)
        setTimeout(() => setSkipAnimation(null), 500)
    }

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }, [])

    const togglePiP = useCallback(async () => {
        const video = videoRef.current
        if (!video) return

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture()
            } else if (document.pictureInPictureEnabled) {
                await video.requestPictureInPicture()
            }
        } catch (e) { }
    }, [videoRef])

    return (
        <div className={`video-controls ${showControls || !isPlaying || isEnded ? 'visible' : ''}`}>
            <div className="controls-top">
                <div className="controls-top-left">
                    <button className="control-btn" onClick={onMinimize} aria-label="Minimize">
                        <svg viewBox="0 0 24 24">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                        </svg>
                    </button>
                    <span className="video-title-overlay">{title}</span>
                </div>
                <div className="controls-top-right">
                    <button className="control-btn" onClick={togglePiP} aria-label="Picture in Picture">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                        </svg>
                    </button>
                    <button className="control-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
                        <svg viewBox="0 0 24 24">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                        </svg>
                    </button>
                    <button className="control-btn" onClick={onClose} aria-label="Close">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="controls-center">
                <button className="control-btn skip-btn" onClick={() => handleSkip(-10)} aria-label="Rewind 10 seconds">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11H10v-3.3L9 13l-.5-.5 1.5-1.5h.9v4zm2.7.5c-.5 0-.9-.2-1.2-.5-.3-.3-.5-.7-.5-1.2v-2.1c0-.5.2-.9.5-1.2.3-.3.7-.5 1.2-.5s.9.2 1.2.5c.3.3.5.7.5 1.2v2.1c0 .5-.2.9-.5 1.2-.3.3-.7.5-1.2.5zm.5-3.7c0-.3-.2-.5-.5-.5s-.5.2-.5.5v2c0 .3.2.5.5.5s.5-.2.5-.5v-2z" />
                    </svg>
                    <span className="skip-text">10</span>
                </button>

                <button className="control-btn large" onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
                    {isPlaying ? (
                        <svg viewBox="0 0 24 24">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <button className="control-btn skip-btn" onClick={() => handleSkip(10)} aria-label="Forward 10 seconds">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-1.1 11H10v-3.3L9 13l-.5-.5 1.5-1.5h.9v4zm2.7.5c-.5 0-.9-.2-1.2-.5-.3-.3-.5-.7-.5-1.2v-2.1c0-.5.2-.9.5-1.2.3-.3.7-.5 1.2-.5s.9.2 1.2.5c.3.3.5.7.5 1.2v2.1c0 .5-.2.9-.5 1.2-.3.3-.7.5-1.2.5zm.5-3.7c0-.3-.2-.5-.5-.5s-.5.2-.5.5v2c0 .3.2.5.5.5s.5-.2.5-.5v-2z" />
                    </svg>
                    <span className="skip-text">10</span>
                </button>
            </div>

            {skipAnimation && (
                <div className={`skip-animation ${skipAnimation}`}>
                    <svg viewBox="0 0 24 24">
                        {skipAnimation === 'left' ? (
                            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                        ) : (
                            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                        )}
                    </svg>
                </div>
            )}

            <div className="controls-bottom">
                <ProgressBar
                    currentTime={currentTime}
                    duration={duration}
                    buffered={buffered}
                    onSeek={onSeek}
                />
                <div className="time-display">
                    <span>{formatDuration(currentTime)}</span>
                    <span>/</span>
                    <span>{formatDuration(duration)}</span>
                </div>
            </div>
        </div>
    )
}
