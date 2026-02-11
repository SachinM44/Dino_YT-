export function AppBar() {
    return (
        <header className="app-bar">
            <div className="app-bar-logo">
                <img width={150} height={25} src="/yt.svg" alt="yt" />
            </div>
            <div className="app-bar-actions">
                <button className="app-bar-btn" aria-label="Cast">
                    <img src="/yt_cast.svg" alt="Cast" className="app-bar-icon" />
                </button>
                <button className="app-bar-btn" aria-label="Notifications">
                    <img src="/bell.svg" alt="Notifications" className="app-bar-icon" />
                </button>
                <button className="app-bar-btn" aria-label="Search">
                    <img src="/search.svg" alt="Search" className="app-bar-icon" />
                </button>
            </div>
        </header>
    )
}
