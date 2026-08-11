import React, { useState } from "react";
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaRandom, FaHeart, FaRegHeart, FaEllipsisH, FaVolumeUp, FaRedo
} from "react-icons/fa";
import { formatTime } from "../utils/helper";
import "../../css/layout/RightPlayerPanel.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateFavourites } from "../../redux/slices/authSlice";
import { openAuthModal } from "../../redux/slices/uiSlice";

const RightPlayerPanel = ({ playerState, playerControls, playerFeatures }) => {
    const { currentSong, isPlaying, isLoading, currentTime, duration, shuffleEnabled, isMuted, loopEnabled } = playerState;
    const { handleTogglePlay, handleNext, handlePrev, handleSeek } = playerControls;
    const { onToggleShuffle, onChangeVolume, onToggleMute, onToggleLoop } = playerFeatures;

    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [likeLoading, setLikeLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const currentSongId = currentSong?.id;
    const isLiked = Boolean(
        currentSongId &&
        user?.favourites?.some((fav) => String(fav.id) === String(currentSongId))
    );

    const handleLike = async () => {
        if (!isAuthenticated) {
            dispatch(openAuthModal("login"));
            return;
        }

        if (!currentSong || likeLoading) return;

        try {
            setLikeLoading(true);
            const songData = {
                id: currentSong.id,
                name: currentSong.name,
                artist_name: currentSong.artist_name,
                image: currentSong.image,
                duration: currentSong.duration,
                audio: currentSong.audio,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
                { song: songData },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            dispatch(updateFavourites(res.data.favourites));
        } catch (error) {
            console.error("Like failed:", error.response?.data || error.message);
        } finally {
            setLikeLoading(false);
        }
    };

    if (!currentSong) {
        return (
            <aside className="right-player-panel">
                <div className="player-empty">
                    <div className="player-empty-icon">🎵</div>
                    <p className="player-empty-text">No song playing</p>
                    <p className="player-empty-subtext">Select a song to start</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="right-player-panel">
            {/* Header */}
            <div className="player-header">
                <h3 className="player-title">Player</h3>
                <div className="player-menu-container">
                    <button
                        className="player-menu-btn"
                        onClick={() => setShowMenu(!showMenu)}
                        aria-label="More options"
                    >
                        <FaEllipsisH />
                    </button>
                    {showMenu && (
                        <div className="player-context-menu">
                            <button className={`context-menu-item ${isMuted ? 'active' : ''}`} onClick={() => { onToggleMute(); setShowMenu(false); }}>
                                <FaVolumeUp size={14} />
                                <span>{isMuted ? "Unmute" : "Mute"}</span>
                            </button>
                            <button className={`context-menu-item ${loopEnabled ? 'active' : ''}`} onClick={() => { onToggleLoop(); setShowMenu(false); }}>
                                <FaRedo size={14} />
                                <span>{loopEnabled ? "Disable Loop" : "Enable Loop"}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Album Artwork */}
            <div className="player-artwork">
                {isLoading && (
                    <div className="player-loading-overlay">
                        <div className="player-spinner"></div>
                    </div>
                )}
                <img
                    src={currentSong.image}
                    alt={currentSong.name}
                    className="player-artwork-img"
                />
            </div>

            {/* Song Info */}
            <div className="player-info">
                <h2 className="player-song-name">{currentSong.name}</h2>
                <p className="player-artist-name">{currentSong.artist_name}</p>
            </div>

            {/* Progress Bar */}
            <div className="player-progress-section">
                <div className="player-time-display">
                    <span className="player-time-current">{formatTime(currentTime)}</span>
                    <span className="player-time-total">{formatTime(duration)}</span>
                </div>
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    className="player-seek-bar"
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    style={{
                        background: `linear-gradient(to right, #5B7FFF ${duration ? (currentTime / duration) * 100 : 0
                            }%, #333 ${duration ? (currentTime / duration) * 100 : 0}%)`
                    }}
                />
            </div>

            {/* Controls */}
            <div className="player-controls">
                <button
                    className={`player-control-btn ${shuffleEnabled ? 'active' : ''}`}
                    onClick={onToggleShuffle}
                    title="Shuffle"
                >
                    <FaRandom size={18} />
                </button>

                <button
                    className="player-control-btn"
                    onClick={handlePrev}
                    title="Previous"
                >
                    <FaStepBackward size={20} />
                </button>

                <button
                    className="player-play-btn"
                    onClick={handleTogglePlay}
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>

                <button
                    className="player-control-btn"
                    onClick={handleNext}
                    title="Next"
                >
                    <FaStepForward size={20} />
                </button>

                {/* Like Button - Always Visible */}
                <button
                    className={`player-control-btn like-btn ${isLiked ? "active" : ""}`}
                    onClick={handleLike}
                    title={isLiked ? "Remove from favourites" : "Add to favourites"}
                >
                    {isLiked ? (
                        <FaHeart color="#EC4899" size={18} />
                    ) : (
                        <FaRegHeart size={18} />
                    )}
                </button>
            </div>
        </aside>
    );
};

export default RightPlayerPanel;
