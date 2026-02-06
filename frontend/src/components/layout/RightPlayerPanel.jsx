import React from "react";
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaRandom, FaHeart, FaRegHeart, FaEllipsisH
} from "react-icons/fa";
import { formatTime } from "../utils/helper";
import "../../css/layout/RightPlayerPanel.css";

const RightPlayerPanel = ({ playerState, playerControls, playerFeatures }) => {
    const { currentSong, isPlaying, currentTime, duration, shuffleEnabled } = playerState;
    const { handleTogglePlay, handleNext, handlePrev, handleSeek } = playerControls;
    const { onToggleShuffle, onChangeVolume } = playerFeatures;

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
                <button className="player-menu-btn">
                    <FaEllipsisH />
                </button>
            </div>

            {/* Album Artwork */}
            <div className="player-artwork">
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

                <button
                    className="player-control-btn"
                    title="More options"
                >
                    <FaEllipsisH size={18} />
                </button>
            </div>
        </aside>
    );
};

export default RightPlayerPanel;
