export function AppBar() {
    return (
        <header className="app-bar">
            <div className="app-bar-logo">
                   <img width={150} height={25} src="public/yt.svg" alt="yt" />
            </div>
            <div className="app-bar-actions">
                <button className="app-bar-btn" aria-label="Cast">
                   <img src="public/yt_cast.svg" alt="Cast" />
                </button>
                <button className="app-bar-btn" aria-label="Notifications">
                    <img src="public/bell.svg" alt="Notifications" />
                </button>
                <button className="app-bar-btn" aria-label="Search">
                    <img src="public/search.svg" alt="Search" />
                </button>
                <button className="app-bar-btn" aria-label="Profile">
                    <img src="public/profile.svg" alt="Profile" />
                </button>
            </div>
        </header>
    )
}
