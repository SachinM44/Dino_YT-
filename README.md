# Dino Ventures Video Player



## Features

### Core Features
- **Home Page** - Scrollable video feed grouped by category with thumbnails, duration badges, and category pills
- **Full-Page Video Player** - HLS streaming with custom controls (play/pause, ±10s skip, seekable progress bar)
- **Related Videos** - Same-category videos displayed in the player view
- **Mini-Player** - Drag-to-minimize with persistent playback while browsing
- **Responsive Design** - Mobile-first with breakpoints at 500px, 768px, 900px, and 1200px

### Bonus Features
- **Auto-play Next** - 2-second countdown before playing next video in category
- **Picture-in-Picture** - Browser PiP API support
- **Skip Animations** - Visual ripple feedback on ±10s buttons
- **Touch Gestures** - Drag-to-minimize, touch-friendly controls

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Video | HLS.js |
| Styling | Vanilla CSS |
| State | React Context + useReducer |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Dino-yt

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist` folder.

## Project Structure

```
src/
├── components/
│   ├── AppBar.tsx          # YouTube-style app bar
│   ├── VideoCard.tsx       # Video thumbnail cards
│   └── VideoPlayer/
│       ├── VideoPlayer.tsx # Main player component
│       ├── Controls.tsx    # Player controls overlay
│       ├── ProgressBar.tsx # Seekable progress bar
│       └── RelatedVideos.tsx
├── contexts/
│   └── PlayerContext.tsx   # Global player state
├── hooks/
│   ├── useHLS.ts          # HLS.js integration
│   └── useDragGesture.ts  # Touch/mouse drag handling
├── data/
│   └── videos.ts          # Video dataset with HLS streams
├── types.ts               # TypeScript interfaces
├── App.tsx                # Main application
└── index.css              # Global styles
```

## Design Decisions

### Video Source Strategy
The provided dataset contains YouTube embed URLs which cannot have custom controls. To demonstrate full video player capabilities, the app uses public HLS test streams while preserving the original thumbnails and metadata.

### State Management
Used React Context with useReducer for global player state instead of external libraries to keep the bundle size minimal and code straightforward.

### Styling
Vanilla CSS with CSS custom properties for theming. YouTube's exact color palette (#0f0f0f, #ff0000) for authentic appearance.

## License

MIT
