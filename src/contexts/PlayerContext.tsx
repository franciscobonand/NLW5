import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    play: (episode: Episode) => void
    togglePlay: () => void
    setPlayingState: (state: boolean) => void
    playList: (ist: Episode[], index: number) => void
    playNext: () => void
    playPrevious: () => void
    hasNext: boolean
    hasPrevious: boolean
    toggleLoop: () => void
    isLooping: boolean
    toggleShuffle: () => void
    isShuffling: boolean
    clearPlayerState: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
    const [episodeList, setEpList] = useState([])
    const [currentEpisodeIndex, setCurrEpIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length
    const hasPrevious = currentEpisodeIndex - 1 >= 0

    function play(episode: Episode) {
        setEpList([episode])
        setCurrEpIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpList(list)
        setCurrEpIndex(index)
        setIsPlaying(true)
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop() {
        setIsLooping(!isLooping)
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function playNext() {
        if (isShuffling) {
            const nxtRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrEpIndex(nxtRandomEpisodeIndex)
        } else if(hasNext) {
            setCurrEpIndex(currentEpisodeIndex + 1)
        }
    }

    function playPrevious() {
        if(hasPrevious) {
            setCurrEpIndex(currentEpisodeIndex - 1)
        }
    }

    function clearPlayerState() {
		setEpList([])
        setCurrEpIndex(0)
	}

    return (
    <PlayerContext.Provider 
        value={{
            episodeList,
            currentEpisodeIndex,
            play,
            isPlaying,
            togglePlay,
            setPlayingState,
            playList,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious,
            isLooping,
            toggleLoop,
            toggleShuffle,
            isShuffling,
            clearPlayerState
        }}>
        {children}
    </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}