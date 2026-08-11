import { useReducer, useRef, useState, useCallback } from "react";

const initialAudioState = {
    isPlaying: false,
    isLoading: false,
    isMuted: false,
    volume: 1,
    loopEnabled: false,
    shuffleEnabled: false,
    playbackSpeed: 1,
    currentIndex: null,
    currentSong: null,
    currentTime: 0
}

function audioReducer(state, action) {
    switch (action.type) {
        case "LOADING":
            return { ...state, isLoading: true };
        case "PLAY":
            return { ...state, isPlaying: true, isLoading: false };
        case "PAUSE":
            return { ...state, isPlaying: false };
        case "MUTE":
            return { ...state, isMuted: true };
        case "UNMUTE":
            return { ...state, isMuted: false };
        case "SET_VOLUME":
            return { ...state, volume: action.payload };
        case "TOGGLE_LOOP":
            return { ...state, loopEnabled: !state.loopEnabled, shuffleEnabled: false };
        case "TOGGLE_SHUFFLE":
            return { ...state, shuffleEnabled: !state.shuffleEnabled, loopEnabled: false };
        case "SET_PLAYBACK_SPEED":
            return { ...state, playbackSpeed: action.payload };
        case "SET_CURRENT_TRACK":
            return { ...state, currentIndex: action.payload.index, currentSong: action.payload.song, isLoading: true };
        case "SET_CURRENT_TIME":
            return { ...state, currentTime: action.payload };
        default:
            return state;
    }
}

const useAudioPlayer = (songs = []) => {
    const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);
    const [duration, setDuration] = useState(0);
    const previousVolumeRef = useRef(1);
    const audioRef = useRef(null);
    const playPromiseRef = useRef(null);

    const handleTogglePlay = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (audio.paused) {
                if (playPromiseRef.current) await playPromiseRef.current;
                playPromiseRef.current = audio.play();
                await playPromiseRef.current;
                dispatch({ type: "PLAY" });
            } else {
                audio.pause();
                dispatch({ type: "PAUSE" });
            }
        } catch (error) {
            console.error("Toggle Play Error:", error);
        }
    }, []);

    // Play a song at specific index value
    const playSongAtIndex = useCallback(async (index) => {
        if (!songs || songs.length === 0) {
            console.warn("No songs available to play.");
            return;
        }

        if (index < 0 || index >= songs.length) return;

        // Optimization: If clicking the same song, just toggle play/pause
        // Comparing IDs is safer than indices when lists change
        if (audioState.currentSong && songs[index].id === audioState.currentSong.id) {
            handleTogglePlay();
            return;
        }

        const song = songs[index];

        dispatch({
            type: "SET_CURRENT_TRACK",
            payload: { index, song }
        });

        dispatch({ type: "SET_CURRENT_TIME", payload: 0 });

        const audio = audioRef.current;
        if (!audio) return;

        try {
            dispatch({ type: "LOADING" });
            audio.load();
            audio.playbackRate = audioState.playbackSpeed;
            audio.volume = audioState.volume;

            // Handle Play Promise to avoid race conditions
            if (playPromiseRef.current) {
                await playPromiseRef.current;
            }

            playPromiseRef.current = audio.play();
            await playPromiseRef.current;
            dispatch({ type: "PLAY" });
            await playPromiseRef.current;
            dispatch({ type: "PLAY" });
        } catch (error) {
            // Ignore AbortError as it's expected during rapid song switching
            if (error.name === "AbortError") {
                // console.log("Play aborted");
            } else {
                console.error("Play Error:", error);
                dispatch({ type: "PAUSE" });
            }
        }
    }, [songs, audioState.playbackSpeed, audioState.volume, audioState.currentSong, handleTogglePlay]);

    const handleNext = useCallback(() => {
        if (!songs.length) return;

        if (audioState.currentIndex === null) {
            playSongAtIndex(0);
            return;
        }

        // If shuffle is Enabled
        if (audioState.shuffleEnabled && songs.length > 1) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songs.length);
            } while (randomIndex === audioState.currentIndex);
            playSongAtIndex(randomIndex);
            return;
        }

        const nextIndex = (audioState.currentIndex + 1) % songs.length;
        playSongAtIndex(nextIndex);
    }, [songs, audioState.currentIndex, audioState.shuffleEnabled, playSongAtIndex]);

    const handlePrev = useCallback(() => {
        if (!songs.length) return;
        if (audioState.currentIndex === null) {
            playSongAtIndex(0);
            return;
        }
        const prevIndex = (audioState.currentIndex - 1 + songs.length) % songs.length;
        playSongAtIndex(prevIndex);
    }, [songs, audioState.currentIndex, playSongAtIndex]);

    // Audio event handle
    const handleTimeUpdate = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        dispatch({
            type: "SET_CURRENT_TIME",
            payload: audio.currentTime || 0,
        });
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        setDuration(audio.duration || 0);
        audio.playbackRate = audioState.playbackSpeed;
        audio.volume = audioState.volume;
        audio.muted = audioState.isMuted;

        // Auto-play when metadata loads if we have a song
        if (audioState.currentSong && !audioState.isPlaying) {
            // Optional: Decide strictly if we want auto-play here, usually controlled by playSongAtIndex
            // But playSongAtIndex calls .play() directly, so this might be redundant or for safety.
            // We'll leave it to playSongAtIndex to drive playback.
        }
    }, [audioState.playbackSpeed, audioState.volume, audioState.isMuted, audioState.currentSong, audioState.isPlaying]);

    const handleEnded = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audioState.loopEnabled) {
            audio.currentTime = 0;
            audio.play().then(() => {
                dispatch({ type: "PLAY" });
                dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
            }).catch((e) => {
                console.error("Replay error.", e);
            });
        } else {
            handleNext();
        }
    }, [audioState.loopEnabled, handleNext]);

    const handleToggleMute = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audioState.isMuted) {
            const restoreVolume = previousVolumeRef.current || 1;
            audio.muted = false;
            audio.volume = restoreVolume;
            dispatch({ type: "UNMUTE" });
            dispatch({ type: "SET_VOLUME", payload: restoreVolume });
        } else {
            previousVolumeRef.current = audioState.volume || 1;
            audio.muted = true;
            audio.volume = 0;
            dispatch({ type: "MUTE" });
            dispatch({ type: "SET_VOLUME", payload: 0 });
        }
    }, [audioState.isMuted, audioState.volume]);

    const handleToggleLoop = useCallback(() => {
        dispatch({ type: "TOGGLE_LOOP" });
    }, []);

    const handleToggleShuffle = useCallback(() => {
        dispatch({ type: "TOGGLE_SHUFFLE" });
    }, []);

    const handleChangeSpeed = useCallback((newSpeed) => {
        const audio = audioRef.current;
        dispatch({ type: "SET_PLAYBACK_SPEED", payload: newSpeed });
        if (audio) {
            audio.playbackRate = newSpeed;
        }
    }, []);

    const handleSeek = useCallback((newTime) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = newTime;
        dispatch({ type: "SET_CURRENT_TIME", payload: newTime });
    }, []);

    const handleChangeVolume = useCallback((newVolume) => {
        const audio = audioRef.current;
        if (newVolume > 0) {
            previousVolumeRef.current = newVolume;
        }
        dispatch({ type: "SET_VOLUME", payload: newVolume });
        if (!audio) return;

        audio.volume = newVolume;

        if (newVolume === 0) {
            audio.muted = true;
            dispatch({ type: "MUTE" });
        } else if (audioState.isMuted) {
            audio.muted = false;
            dispatch({ type: "UNMUTE" });
        }
    }, [audioState.isMuted]);

    return {
        audioRef,
        ...audioState,
        duration,
        playSongAtIndex,
        handleTogglePlay,
        handleNext,
        handlePrev,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded,
        handleToggleMute,
        handleToggleLoop,
        handleToggleShuffle,
        handleChangeSpeed,
        handleSeek,
        handleChangeVolume,
    };
};

export default useAudioPlayer;
