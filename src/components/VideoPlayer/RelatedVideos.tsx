import type { Video } from '../../types'
import { formatDuration, getRelatedVideos } from '../../data/videos'
import { usePlayer } from '../../contexts/PlayerContext'

interface RelatedVideosProps {
    video: Video
}

export function RelatedVideos({ video }: RelatedVideosProps) {
    const { dispatch } = usePlayer()
    const related = getRelatedVideos(video)

    const handleVideoClick = (v: Video) => {
        dispatch({ type: 'SET_VIDEO', video: v })
    }

    if (related.length === 0) return null

    return (
        <div className="related-videos-panel">
            <div className="related-videos-header">
                <img src={video.categoryIcon} alt="" style={{ width: 20, height: 20 }} />
                <span>{video.categoryName}</span>
            </div>
            <div className="related-video-list">
                {related.map(v => (
                    <div key={v.id} className="related-video-item" onClick={() => handleVideoClick(v)}>
                        <div className="related-video-thumb">
                            <img src={v.thumbnailUrl} alt={v.title} loading="lazy" />
                            <span className="related-video-duration">{formatDuration(v.duration)}</span>
                        </div>
                        <div className="related-video-info">
                            <h4 className="related-video-title">{v.title}</h4>
                            <span className="related-video-meta">{v.categoryName}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
