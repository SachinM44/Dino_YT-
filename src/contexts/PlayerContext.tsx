import { createContext, useContext, useReducer, useRef, type ReactNode, type RefObject } from 'react'
import type { PlayerState, PlayerAction } from '../types'

const initialState: PlayerState = {
    currentVideo: null,
    mode: 'hidden',
    playbackPosition: 0,
    isPlaying: false,
    isMuted: false,
    volume: 1,
    duration: 0,
    buffered: 0
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
    switch (action.type) {
        case 'SET_VIDEO':
            return { ...state, currentVideo: action.video, mode: 'full', playbackPosition: 0, duration: action.video.duration }
        case 'SET_MODE':
            return { ...state, mode: action.mode }
        case 'SET_PLAYING':
            return { ...state, isPlaying: action.isPlaying }
        case 'SET_POSITION':
            return { ...state, playbackPosition: action.position }
        case 'SET_DURATION':
            return { ...state, duration: action.duration }
        case 'SET_BUFFERED':
            return { ...state, buffered: action.buffered }
        case 'SET_MUTED':
            return { ...state, isMuted: action.isMuted }
        case 'SET_VOLUME':
            return { ...state, volume: action.volume }
        case 'CLOSE':
            return { ...initialState }
        default:
            return state
    }
}

interface PlayerContextType {
    state: PlayerState
    dispatch: React.Dispatch<PlayerAction>
    videoRef: RefObject<HTMLVideoElement | null>
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(playerReducer, initialState)
    const videoRef = useRef<HTMLVideoElement>(null)

    return (
        <PlayerContext.Provider value={{ state, dispatch, videoRef }}>
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayer must be used within PlayerProvider')
    }
    return context
}
