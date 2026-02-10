import { useRef, useEffect, useState, useCallback, type MouseEvent, type TouchEvent } from 'react'
import { formatDuration } from '../../data/videos'

interface ProgressBarProps {
    currentTime: number
    duration: number
    buffered: number
    onSeek: (time: number) => void
}

export function ProgressBar({ currentTime, duration, buffered, onSeek }: ProgressBarProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [hoverTime, setHoverTime] = useState<number | null>(null)
    const [hoverPosition, setHoverPosition] = useState(0)

    const calculateTime = useCallback((clientX: number): number => {
        if (!containerRef.current) return 0
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
        return (x / rect.width) * duration
    }, [duration])

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true)
        const time = calculateTime(e.clientX)
        onSeek(time)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        setHoverPosition(x)
        setHoverTime(calculateTime(e.clientX))

        if (isDragging) {
            onSeek(calculateTime(e.clientX))
        }
    }

    const handleMouseLeave = () => {
        setHoverTime(null)
    }

    const handleTouchStart = (e: TouchEvent) => {
        setIsDragging(true)
        const time = calculateTime(e.touches[0].clientX)
        onSeek(time)
    }

    const handleTouchMove = (e: TouchEvent) => {
        const time = calculateTime(e.touches[0].clientX)
        onSeek(time)
    }

    useEffect(() => {
        if (!isDragging) return

        const handleUp = () => setIsDragging(false)
        window.addEventListener('mouseup', handleUp)
        window.addEventListener('touchend', handleUp)

        return () => {
            window.removeEventListener('mouseup', handleUp)
            window.removeEventListener('touchend', handleUp)
        }
    }, [isDragging])

    const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0
    const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0

    return (
        <div
            ref={containerRef}
            className="progress-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <div className="progress-buffered" style={{ width: `${bufferedPercent}%` }} />
            <div className="progress-played" style={{ width: `${playedPercent}%` }} />
            <div className="progress-thumb" style={{ left: `${playedPercent}%` }} />
            {hoverTime !== null && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: hoverPosition,
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontSize: '12px',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {formatDuration(hoverTime)}
                </div>
            )}
        </div>
    )
}
