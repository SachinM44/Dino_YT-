import type { Video } from '../types'
import { formatDuration } from '../data/videos'

interface VideoCardProps {
    video: Video
    onClick: (video: Video) => void
}

export function VideoCard({ video, onClick }: VideoCardProps) {
    return (
        <div className="video-card" onClick={() => onClick(video)}>
            <div className="video-card-thumbnail">
                <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
                <span className="video-card-duration">{formatDuration(video.duration)}</span>
            </div>
            <div className="video-card-info">
                <h3 className="video-card-title">{video.title}</h3>
                <span className="video-card-category">
                    <img src={video.categoryIcon} alt="" />
                    {video.categoryName}
                </span>
            </div>
        </div>
    )
}
