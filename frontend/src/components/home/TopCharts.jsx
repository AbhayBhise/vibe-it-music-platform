import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaEllipsisH, FaPlus, FaStepForward } from "react-icons/fa";
import { formatTime } from "../utils/helper";
import "../../css/home/TopCharts.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateFavourites } from "../../redux/slices/authSlice";
import { openAuthModal } from "../../redux/slices/uiSlice";
import toast from 'react-hot-toast';

const TopCharts = ({ songs = [], onSelectSong, currentIndex, currentSong, isPlaying }) => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [likeLoading, setLikeLoading] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);

    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRefs = React.useRef({});

    const handleLike = async (e, song) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            dispatch(openAuthModal("login"));
            return;
        }
        if (likeLoading) return;

        try {
            setLikeLoading(true);
            const songData = {
                id: song.id,
                name: song.name,
                artist_name: song.artist_name,
                image: song.image,
                duration: song.duration,
                audio: song.audio,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
                { song: songData },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            dispatch(updateFavourites(res.data.favourites));
            toast.success(res.data.message || "Added to favourites");
        } catch (error) {
            console.error("Like failed:", error);
            toast.error(error.response?.data?.message || "Failed to update favourites");
        } finally {
            setLikeLoading(false);
        }
    };

    const isLiked = (songId) => {
        return user?.favourites?.some(fav => String(fav.id) === String(songId));
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        e.preventDefault();

        if (menuOpenId === id) {
            setMenuOpenId(null);
            return;
        }

        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            // Position menu below button, aligned to right edge of button (minus width of menu approx 180px)
            // Or simpler: align to right of viewport? No, align to button.
            // Let's align left to (btn.right - 180).
            const menuWidth = 180;
            const leftPos = rect.right - menuWidth;

            setMenuPosition({
                top: rect.bottom + 8,
                left: leftPos
            });
            setMenuOpenId(id);
        }
    };

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.closest('.chart-context-menu') || e.target.closest('.menu-btn')) return;
            setMenuOpenId(null);
        };

        // Update position on scroll to avoid detached menu
        const handleScroll = () => {
            if (menuOpenId) setMenuOpenId(null);
        };

        document.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [menuOpenId]);

    // Find active song for menu
    const activeMenuSong = songs.find(s => s.id === menuOpenId);

    return (
        <div className="top-charts">
            <div className="top-charts-list">
                {songs.map((song, index) => {
                    // Fix: Highlight based on ID match if currentSong exists
                    const isCurrent = currentSong && String(song.id) === String(currentSong.id);
                    // Also use isPlaying from props to toggle icon
                    const showPause = isCurrent && isPlaying;

                    const liked = isLiked(song.id);

                    return (
                        <div
                            key={song.id}
                            className={`chart-item ${isCurrent ? "active" : ""}`}
                            onClick={() => onSelectSong(index)}
                        >
                            {/* Rank */}
                            <span className="chart-rank">
                                {isCurrent ? (
                                    <div className="playing-bars">
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                    </div>
                                ) : (
                                    (index + 1).toString().padStart(2, "0")
                                )}
                            </span>

                            {/* Artwork */}
                            <div className="chart-artwork">
                                <img src={song.image} alt={song.name} />
                                <div className="chart-play-overlay">
                                    {showPause ? <FaPause size={12} /> : <FaPlay size={12} />}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="chart-info">
                                <h4 className="chart-song-name">{song.name}</h4>
                                <p className="chart-artist-name">{song.artist_name}</p>
                            </div>

                            {/* Duration */}
                            <span className="chart-duration">{formatTime(song.duration)}</span>

                            {/* Actions */}
                            <div className="chart-actions">
                                <button
                                    className={`chart-action-btn like-btn ${liked ? 'active' : ''}`}
                                    onClick={(e) => handleLike(e, song)}
                                    title={liked ? "Unlike" : "Like"}
                                >
                                    {liked ? <FaHeart color="#EC4899" size={16} /> : <FaRegHeart size={16} />}
                                </button>

                                <div className="chart-menu-wrapper">
                                    <button
                                        ref={el => buttonRefs.current[song.id] = el}
                                        className="chart-action-btn menu-btn"
                                        onClick={(e) => toggleMenu(e, song.id)}
                                    >
                                        <FaEllipsisH size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Portal Context Menu */}
            {menuOpenId && activeMenuSong && ReactDOM.createPortal(
                <div
                    className="chart-context-menu"
                    style={{
                        position: 'fixed',
                        top: menuPosition.top,
                        left: menuPosition.left,
                        zIndex: 9999,
                        margin: 0
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="context-item">
                        <FaPlus size={12} /> Add to Playlist
                    </button>
                    <button className="context-item">
                        <FaStepForward size={12} /> Play Next
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

export default TopCharts;
