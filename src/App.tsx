import { PlayerProvider, usePlayer } from './contexts/PlayerContext'
import { AppBar } from './components/AppBar'
import { VideoCard } from './components/VideoCard'
import { VideoPlayer } from './components/VideoPlayer'
import { categories } from './data/videos'
import type { Video } from './types'
import './index.css'

function HomePage() {
  const { dispatch } = usePlayer()

  const handleVideoClick = (video: Video) => {
    dispatch({ type: 'SET_VIDEO', video })
  }

  return (
    <div className="main-content">
      {categories.map(category => (
        <section key={category.slug} className="category-section">
          <div className="category-header">
            <img src={category.iconUrl} alt="" className="category-icon" />
            <h2 className="category-name">{category.name}</h2>
          </div>
          <div className="video-grid">
            {category.videos.map(video => (
              <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function AppContent() {
  const { state } = usePlayer()
  const showHomePage = state.mode !== 'full'

  return (
    <div className="app">
      {showHomePage && (
        <>
          <AppBar />
          <HomePage />
        </>
      )}
      <VideoPlayer />
    </div>
  )
}

function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  )
}

export default App
